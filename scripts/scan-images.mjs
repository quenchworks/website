#!/usr/bin/env node
// Scan every catalog image with Trivy and write src/data/security.json.
//
// Self-contained and independent of ArtifactHub: it reads the image ref + EVERY
// published version's digest from src/data/images.json (which gen-catalog.py keeps
// strictly aligned to each app's build.conf VERSIONS — no registry extras), and runs
// Trivy against each exact digest. Scanning by digest (not tag) means the result is
// pinned to precisely the artifact we ship.
//
// Per version: severity breakdown, a `fixable` count (CVEs with a FixedVersion — what
// our 0-CVE gate and a rebuild would clear), a letter `grade`, and a numeric `score`.
// Each image's top-level summary is its WORST version (so a card flags if ANY tag has
// CVEs), plus a `versions` array with the per-tag detail so you can see what to fix.
//
// Usage:
//   node scripts/scan-images.mjs              # all images (the nightly job)
//   node scripts/scan-images.mjs neo4j redis  # a subset, merged into existing
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const images = JSON.parse(readFileSync(ROOT + 'src/data/images.json', 'utf8'));
const only = process.argv.slice(2);

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

function scan(ref) {
  const out = execFileSync(
    'trivy',
    ['image', '--quiet', '--format', 'json', '--scanners', 'vuln',
     '--severity', 'CRITICAL,HIGH,MEDIUM,LOW,UNKNOWN', ref],
    { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, timeout: 300_000 },
  );
  const data = JSON.parse(out);
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

const result = {};
let scanned = 0, failed = 0;
for (const e of images) {
  if (only.length && !only.includes(e.slug)) continue;
  const vers = (e.versions || []).filter((v) => v.digest);
  if (!e.image || !vers.length) { console.error(`skip ${e.slug} (no published versions)`); continue; }

  const perVersion = [];
  for (const v of vers) {
    let c;
    try {
      c = scan(`${e.image}@${v.digest}`);
    } catch {
      try { c = scan(`${e.image}@${v.digest}`); } // one retry
      catch (err2) { failed++; console.error(`FAIL ${e.slug} ${v.version}: ${String(err2.message).split('\n')[0]}`); continue; }
    }
    const s = summarize(v.version, e.image, c);
    perVersion.push(s);
    scanned++;
    console.error(`${e.slug.padEnd(26)} ${String(v.version).padEnd(14)} total=${c.total} fixable=${c.fixable} grade=${s.grade} score=${s.score}`);
  }
  if (!perVersion.length) continue;

  // top-level summary = the WORST version (most total CVEs), so a card flags any bad tag
  // without triple-counting the same CVE across version lines.
  const worst = perVersion.reduce((a, b) => (b.total > a.total ? b : a));
  result[e.slug] = { image: e.image, ...worst, versions: perVersion };
}

let prev = {};
try { prev = JSON.parse(readFileSync(ROOT + 'src/data/security.json', 'utf8')); } catch { /* first run */ }
const merged = only.length ? { ...prev, ...result } : result;
const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
writeFileSync(ROOT + 'src/data/security.json', JSON.stringify(sorted, null, 2) + '\n');

const totalCves = Object.values(sorted).reduce((a, r) => a + (r.total || 0), 0);
const needFix = Object.values(sorted).filter((r) => (r.fixable || 0) > 0).length;
console.error(`\nscanned=${scanned} versions, failed=${failed} | security.json: ${Object.keys(sorted).length} images, ${totalCves} worst-case CVEs, ${needFix} need a rebuild`);
