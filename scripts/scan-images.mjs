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
// our 0-CVE gate and a rebuild would clear), a letter `grade`, and a numeric `score`.
// Each image's top-level summary is its WORST version (so a card flags if ANY tag has
// CVEs), plus a `versions` array with the per-tag detail so you can see what to fix.
//
// Scans run concurrently (CONCURRENCY workers) so ~400 image-versions finish in minutes,
// not hours. Run `trivy image --download-db-only` once before this to avoid a DB race.
//
// Usage:
//   node scripts/scan-images.mjs              # all images (the nightly job)
//   node scripts/scan-images.mjs neo4j redis  # a subset, merged into existing
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const ROOT = new URL('..', import.meta.url).pathname;
const images = JSON.parse(readFileSync(ROOT + 'src/data/images.json', 'utf8'));
const only = process.argv.slice(2);
const CONCURRENCY = Number(process.env.SCAN_CONCURRENCY || 10);

const SEV = ['critical', 'high', 'medium', 'low', 'unknown'];

function gradeOf(c) {
  if (c.total === 0) return 'A+';
  if (c.critical) return 'F';
  if (c.high) return 'D';
  if (c.medium) return 'C';
  return 'B'; // only low / unknown
}
function scoreOf(c) {
  const w = c.critical * 25 + c.high * 10 + c.medium * 4 + c.unknown * 2 + c.low * 1 + c.fixable * 5;
  return Math.max(0, 100 - w);
}

async function scanOnce(ref) {
  const { stdout } = await execFileP(
    'trivy',
    ['image', '--quiet', '--format', 'json', '--scanners', 'vuln', '--skip-db-update',
     '--severity', 'CRITICAL,HIGH,MEDIUM,LOW,UNKNOWN', ref],
    { maxBuffer: 128 * 1024 * 1024, timeout: 300_000 },
  );
  const data = JSON.parse(stdout);
  const c = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0, fixable: 0 };
  for (const r of data.Results || []) {
    for (const v of r.Vulnerabilities || []) {
      const s = (v.Severity || 'UNKNOWN').toLowerCase();
      if (s in c) c[s]++; else c.unknown++;
      if (v.FixedVersion) c.fixable++;
    }
  }
  c.total = c.critical + c.high + c.medium + c.low + c.unknown;
  return c;
}

function summarize(version, image, c) {
  const e = { version, tag: `${image}:${version}` };
  for (const s of SEV) e[s] = c[s];
  e.total = c.total; e.fixable = c.fixable; e.grade = gradeOf(c); e.score = scoreOf(c);
  return e;
}

// flat task list: one entry per (image, version)
const tasks = [];
for (const e of images) {
  if (only.length && !only.includes(e.slug)) continue;
  for (const v of e.versions || []) {
    if (v.digest) tasks.push({ slug: e.slug, image: e.image, version: v.version, digest: v.digest });
  }
}

const perImage = {}; // slug -> [version summaries]
let done = 0, failed = 0;
async function worker(queue) {
  for (const t of queue) {
    let c;
    try { c = await scanOnce(`${t.image}@${t.digest}`); }
    catch { try { c = await scanOnce(`${t.image}@${t.digest}`); } // one retry
            catch (err) { failed++; console.error(`FAIL ${t.slug} ${t.version}: ${String(err.message).split('\n')[0]}`); continue; } }
    (perImage[t.slug] ||= []).push(summarize(t.version, t.image, c));
    done++;
    console.error(`[${done}/${tasks.length}] ${t.slug.padEnd(26)} ${String(t.version).padEnd(14)} total=${c.total} fixable=${c.fixable} grade=${gradeOf(c)}`);
  }
}
// split tasks round-robin across workers
const queues = Array.from({ length: CONCURRENCY }, () => []);
tasks.forEach((t, i) => queues[i % CONCURRENCY].push(t));
await Promise.all(queues.map(worker));

const result = {};
for (const [slug, vers] of Object.entries(perImage)) {
  if (!vers.length) continue;
  const e = images.find((x) => x.slug === slug);
  // top-level summary = the WORST version (most total CVEs), no triple-counting
  const worst = vers.reduce((a, b) => (b.total > a.total ? b : a));
  result[slug] = { image: e.image, ...worst, versions: vers.sort((a, b) => (a.version < b.version ? 1 : -1)) };
}

let prev = {};
try { prev = JSON.parse(readFileSync(ROOT + 'src/data/security.json', 'utf8')); } catch { /* first run */ }
const merged = only.length ? { ...prev, ...result } : result;
const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
writeFileSync(ROOT + 'src/data/security.json', JSON.stringify(sorted, null, 2) + '\n');

const totalCves = Object.values(sorted).reduce((a, r) => a + (r.total || 0), 0);
const needFix = Object.values(sorted).filter((r) => (r.fixable || 0) > 0).length;
console.error(`\nscanned=${done} versions, failed=${failed} | security.json: ${Object.keys(sorted).length} images, ${totalCves} worst-case CVEs, ${needFix} need a rebuild`);
