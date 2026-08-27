#!/usr/bin/env node
// Scan every catalog image with Trivy and write src/data/security.json.
//
// Self-contained and independent of ArtifactHub: it reads the image ref + EVERY
// published version's digest from src/data/images.json (which gen-catalog.py keeps
// aligned to each app's build.conf VERSIONS — no registry major-alias tags), and runs
// Trivy against each exact digest. Scanning by digest (not tag) pins the result to
// precisely the artifact we ship.
//
// Per version: severity breakdown, a `fixable` count (CVEs with a FixedVersion — what
// our 0-CVE gate and a rebuild would clear), a letter `grade`, a numeric `score`, and
// `cves[]` — the deduped per-CVE detail (id/severity/pkg/installed/fixed/title/url/targets)
// the detail pages render in their full-report table.
// Each image's top-level summary is its WORST version (so a card flags if ANY tag has
// CVEs), plus a `versions` array with the per-tag detail so you can see what to fix.
//
// Scans run concurrently (CONCURRENCY workers) so ~400 image-versions finish in minutes,
// not hours. Run `trivy image --download-db-only` once before this to avoid a DB race.
//
// Usage:
//   node scripts/scan-images.mjs              # all images (the nightly job)
//   node scripts/scan-images.mjs neo4j redis  # a subset, merged into existing
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const ROOT = new URL('..', import.meta.url).pathname;
const images = JSON.parse(readFileSync(ROOT + 'src/data/images.json', 'utf8'));
const only = process.argv.slice(2);
const CONCURRENCY = Number(process.env.SCAN_CONCURRENCY || 6);

const SEV = ['critical', 'high', 'medium', 'low', 'unknown'];
const SEV_RANK = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, UNKNOWN: 4 };
const TARGETS_CAP = 8; // keep the JSON payload sane for CVEs found in dozens of jars

function gradeOf(c) {
  if (c.total === 0) return 'A+';
  if (c.critical) return 'F';
  if (c.high) return 'D';
  if (c.medium) return 'C';
  if (c.low) return 'B';
  // Only UNKNOWN severity left. UNKNOWN means the advisory carries no CVSS yet -- it is
  // not a quiet LOW, and it is not evidence of anything exploitable. Grading it B put
  // "we don't know" in the same bucket as a real known-severity CVE, which overstated
  // the risk. It gets its own grade (A, coloured differently from A+) until a severity
  // actually lands.
  return 'A';
}
function scoreOf(c) {
  const w = c.critical * 25 + c.high * 10 + c.medium * 4 + c.unknown * 2 + c.low * 1 + c.fixable * 5;
  return Math.max(0, 100 - w);
}

// Turn one Trivy JSON report into { counts, per-CVE rows }.
//
// COUNTS stay raw: every finding is counted exactly once, in the same place it always
// was, so total/fixable/grade/score never move.
//
// ROWS are DEDUPED by `id|pkg|installed`: the same CVE routinely repeats across dozens
// of targets (one bundled jar CVE x every jar that ships it — opensearch reports ~49
// findings that are a handful of real CVEs), and a 49-row table of the same ID is noise.
// Duplicates merge into one row whose `targets` is the union (capped, with `targetsMore`).
// Sorted severity-first, then fixable-first, then id — worst + actionable at the top.
function parseReport(data) {
  const c = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0, fixable: 0 };
  const rows = new Map();
  for (const r of data.Results || []) {
    for (const v of r.Vulnerabilities || []) {
      const s = (v.Severity || 'UNKNOWN').toLowerCase();
      if (s in c) c[s]++; else c.unknown++;
      if (v.FixedVersion) c.fixable++;

      const installed = v.InstalledVersion ?? null;
      const key = `${v.VulnerabilityID}|${v.PkgName}|${installed}`;
      let row = rows.get(key);
      if (!row) {
        rows.set(key, row = {
          id: v.VulnerabilityID,
          severity: (v.Severity || 'UNKNOWN').toUpperCase(),
          pkg: v.PkgName,
          installed,
          fixed: v.FixedVersion ?? null, // null => nothing to rebuild into yet
          title: v.Title ?? v.Description?.slice(0, 160) ?? null,
          url: v.PrimaryURL ?? (v.References || []).find((u) => /^https?:\/\//.test(u)) ?? null,
          targets: [],
        });
      }
      if (r.Target && !row.targets.includes(r.Target)) row.targets.push(r.Target);
    }
  }
  c.total = c.critical + c.high + c.medium + c.low + c.unknown;

  const cves = [...rows.values()].sort((a, b) =>
    (SEV_RANK[a.severity] ?? 9) - (SEV_RANK[b.severity] ?? 9) ||
    Number(!a.fixed) - Number(!b.fixed) ||
    (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (const row of cves) {
    if (row.targets.length > TARGETS_CAP) {
      row.targetsMore = row.targets.length - TARGETS_CAP;
      row.targets.length = TARGETS_CAP;
    }
  }
  return { ...c, cves };
}

async function scanOnce(ref) {
  // --cache-backend memory: keep the per-scan analysis cache in memory so parallel
  //   trivy processes don't fight over the on-disk fanal bolt lock.
  // --skip-db-update: the vuln DB is pre-downloaded once (shared, read-only) by the workflow.
  // --detection-priority comprehensive: REQUIRED to match the build gate. In the default
  //   "precise" mode Trivy drops language files owned by an OS package, so the app's own
  //   Go/Rust binary is skipped and only OS-package CVEs surface -- security.json would
  //   under-report. Comprehensive keeps the gobinary/language analyzers so the published
  //   grade reflects the true dep state.
  const { stdout } = await execFileP(
    'trivy',
    ['image', '--quiet', '--format', 'json', '--scanners', 'vuln',
     '--detection-priority', 'comprehensive',
     '--skip-db-update', '--cache-backend', 'memory',
     '--severity', 'CRITICAL,HIGH,MEDIUM,LOW,UNKNOWN', ref],
    { maxBuffer: 128 * 1024 * 1024, timeout: 300_000 },
  );
  return parseReport(JSON.parse(stdout));
}

function summarize(version, image, c) {
  const e = { version, tag: `${image}:${version}` };
  for (const s of SEV) e[s] = c[s];
  e.total = c.total; e.fixable = c.fixable; e.grade = gradeOf(c); e.score = scoreOf(c);
  e.cves = c.cves ?? [];
  return e;
}

// `node scripts/scan-images.mjs --selftest` — checks parseReport (counts stay raw,
// rows dedupe/sort/cap) without pulling a single image. Runs in ms; no Trivy needed.
if (only[0] === '--selftest') {
  const dupe = (target) => ({
    Target: target,
    Vulnerabilities: [{ VulnerabilityID: 'CVE-2', Severity: 'HIGH', PkgName: 'p', InstalledVersion: '1', FixedVersion: '2', Title: 't2', PrimaryURL: 'https://u2' }],
  });
  const got = parseReport({
    Results: [
      { Target: 'a.jar', Vulnerabilities: [
        { VulnerabilityID: 'CVE-1', Severity: 'CRITICAL', PkgName: 'q', InstalledVersion: '1', Description: 'd'.repeat(300), References: ['ftp://nope', 'https://ref'] },
        { VulnerabilityID: 'CVE-0', Severity: 'HIGH', PkgName: 'p', InstalledVersion: '1', Title: 't0' }, // no FixedVersion
      ] },
      ...Array.from({ length: 10 }, (_, i) => dupe(`t${i}.jar`)), // same CVE in 10 targets
    ],
  });
  assert.equal(got.total, 12, 'counts stay raw (every finding)');
  assert.equal(got.critical, 1);
  assert.equal(got.high, 11);
  assert.equal(got.fixable, 10, 'fixable counts every raw finding, not deduped rows');
  assert.deepEqual(got.cves.map((r) => r.id), ['CVE-1', 'CVE-2', 'CVE-0'], 'severity, then fixable-first, then id');
  assert.equal(got.cves.length, 3, 'deduped by id|pkg|installed');
  assert.equal(got.cves[2].fixed, null, 'no FixedVersion => null');
  assert.equal(got.cves[0].url, 'https://ref', 'falls back to the first http(s) reference');
  assert.equal(got.cves[0].title.length, 160, 'description truncated to 160');
  assert.equal(got.cves[1].targets.length, TARGETS_CAP, 'targets capped');
  assert.equal(got.cves[1].targetsMore, 2, 'and the remainder counted');
  console.error('selftest OK');
  process.exit(0);
}

// flat task list: one entry per (image, version)
const tasks = [];
const seenDigests = new Set();
for (const e of images) {
  if (only.length && !only.includes(e.slug)) continue;
  for (const v of e.versions || []) {
    if (v.digest) {
      tasks.push({ slug: e.slug, image: e.image, version: v.version, digest: v.digest });
      seenDigests.add(v.digest);
    }
  }
}

// ALSO scan every digest a published chart pins, even if images.json does not list it.
//
// This closes a real blind spot, found 2026-08-27. images.json comes from
// catalog.lock.yaml, and an image leaves that lock in two ordinary ways: `status:
// blocked` in catalog.yaml delists it, and bumping build.conf VERSIONS orphans the
// previously published tags. Either way the scanner had nothing to scan and the app
// silently vanished from the board -- while shipped charts kept pinning its digest.
// grafana was exactly this: four SHIPPED stack charts pinned grafana 13.1.0 carrying
// 1 CRITICAL and 17 HIGH, reported nowhere, because grafana is delisted. "Not scanned"
// was reading as "clean".
//
// A digest someone can actually pull by installing our chart must always be scanned.
// These are keyed by `chart:<slug>` so they never overwrite a catalog entry.
const chartsPath = ROOT + 'src/data/charts.json';
let chartTasks = 0;
try {
  const chartsRaw = JSON.parse(readFileSync(chartsPath, 'utf8'));
  const charts = Array.isArray(chartsRaw) ? chartsRaw : (chartsRaw.charts || []);
  for (const c of charts) {
    const refs = [];
    if (c.imageRepository && c.imageDigest) refs.push({ image: c.imageRepository, digest: c.imageDigest });
    for (const i of c.images || []) {
      // entries look like "name: x" / "image: ghcr.io/...@sha256:..."
      const raw = typeof i === 'string' ? i : (i.image || '');
      const m = /^(\S+)@(sha256:[0-9a-f]{64})$/.exec(raw);
      if (m) refs.push({ image: m[1], digest: m[2] });
    }
    for (const r of refs) {
      if (seenDigests.has(r.digest)) continue;      // already covered by the catalog
      seenDigests.add(r.digest);
      const slug = r.image.split('/').pop();
      if (only.length && !only.includes(slug)) continue;
      tasks.push({ slug, image: r.image, version: `chart:${c.slug}`, digest: r.digest, fromChart: c.slug });
      chartTasks++;
    }
  }
  if (chartTasks) console.error(`+${chartTasks} digest(s) pinned by charts but absent from the catalog lock`);
} catch (err) {
  // charts.json is generated; a missing file must not silently shrink the scan.
  console.error(`WARNING: could not read ${chartsPath} (${err.message}); chart-pinned digests NOT scanned`);
}

const perImage = {}; // slug -> [version summaries]
let done = 0, failed = 0;
async function worker(queue) {
  for (const t of queue) {
    let c;
    try { c = await scanOnce(`${t.image}@${t.digest}`); }
    catch { try { c = await scanOnce(`${t.image}@${t.digest}`); } // one retry
            catch (err) { failed++; const why = String(err.stderr || err.message).trim().split('\n').pop(); console.error(`FAIL ${t.slug} ${t.version}: ${why}`); continue; } }
    (perImage[t.slug] ||= []).push(summarize(t.version, t.image, c));
    done++;
    console.error(`[${done}/${tasks.length}] ${t.slug.padEnd(26)} ${String(t.version).padEnd(14)} total=${c.total} fixable=${c.fixable} grade=${gradeOf(c)}`);
  }
}
// split tasks round-robin across workers
const queues = Array.from({ length: CONCURRENCY }, () => []);
tasks.forEach((t, i) => queues[i % CONCURRENCY].push(t));
await Promise.all(queues.map(worker));

// numeric-aware version compare: vcmp(a,b) > 0 when a is newer than b
function vcmp(a, b) {
  const x = (a.match(/\d+/g) || []).map(Number);
  const y = (b.match(/\d+/g) || []).map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d;
  }
  return 0;
}

const result = {};
for (const [slug, vers] of Object.entries(perImage)) {
  if (!vers.length) continue;
  const e = images.find((x) => x.slug === slug);
  // versions newest-first; the top-level summary mirrors the LATEST version (what a
  // card/badge shows, and what new deployments get). Per-version detail stays in `versions`.
  const sorted = vers.slice().sort((a, b) => vcmp(b.version, a.version));
  const latest = sorted[0];
  result[slug] = { image: e.image, ...latest, versions: sorted };
}

let prev = {};
try { prev = JSON.parse(readFileSync(ROOT + 'src/data/security.json', 'utf8')); } catch { /* first run */ }
const merged = only.length ? { ...prev, ...result } : result;
const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
writeFileSync(ROOT + 'src/data/security.json', JSON.stringify(sorted, null, 2) + '\n');

const totalCves = Object.values(sorted).reduce((a, r) => a + (r.total || 0), 0);
const needFix = Object.values(sorted).filter((r) => (r.fixable || 0) > 0).length;
console.error(`\nscanned=${done} versions, failed=${failed} | security.json: ${Object.keys(sorted).length} images, ${totalCves} worst-case CVEs, ${needFix} need a rebuild`);
