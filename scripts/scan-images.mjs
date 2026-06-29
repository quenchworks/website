#!/usr/bin/env node
// Scan every catalog image with Trivy and write src/data/security.json.
//
// Self-contained and independent of ArtifactHub: it reads the image ref + the
// newest published digest straight from src/data/images.json and runs Trivy against
// that exact digest (the image PACKAGES are public, so no auth is needed). Each image
// gets a severity breakdown, a `fixable` count (CVEs that have a FixedVersion — the
// ones our 0-CVE gate cares about), a letter `grade`, and a numeric `score`.
//
// Usage:
//   node scripts/scan-images.mjs              # scan all images (the nightly job)
//   node scripts/scan-images.mjs neo4j redis  # scan a subset, merge into existing
//
// ponytail: one sequential pass. A nightly run of ~140 images is well within the
// Actions time budget; parallelise with a matrix only if it ever gets too slow.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const images = JSON.parse(readFileSync(ROOT + 'src/data/images.json', 'utf8'));
const only = process.argv.slice(2); // optional slug filter; subset runs merge into existing security.json

const SEV = ['critical', 'high', 'medium', 'low', 'unknown'];

// Grade by the worst severity present; A+ only when the image is completely clean.
function gradeOf(c) {
  if (c.total === 0) return 'A+';
  if (c.critical) return 'F';
  if (c.high) return 'D';
  if (c.medium) return 'C';
  return 'B'; // only low / unknown
}
// 100 down, weighted by severity. Fixable CVEs (our responsibility) count double.
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

// newest published version (prefer the one the catalog marks as current) — returns
// {version, digest} so the scan records exactly which tag was checked.
function newestVersion(e) {
  const vers = e.versions || [];
  return vers.find((v) => v.version === e.version) || vers[vers.length - 1];
}

const result = {};
let scanned = 0, failed = 0;
for (const e of images) {
  if (only.length && !only.includes(e.slug)) continue;
  const cur = newestVersion(e);
  if (!e.image || !cur?.digest) { console.error(`skip ${e.slug} (no image/digest)`); continue; }
  const ref = `${e.image}@${cur.digest}`;
  let c;
  try {
    c = scan(ref);
  } catch (err) {
    // one retry (transient registry / DB hiccup), then give up on this image
    try { c = scan(ref); } catch (err2) { failed++; console.error(`FAIL ${e.slug} (${cur.version}): ${String(err2.message).split('\n')[0]}`); continue; }
  }
  const entry = { version: cur.version, tag: `${e.image}:${cur.version}` };
  for (const s of SEV) entry[s] = c[s];
  entry.total = c.total; entry.fixable = c.fixable;
  entry.grade = gradeOf(c); entry.score = scoreOf(c);
  result[e.slug] = entry;
  scanned++;
  console.error(`${e.slug.padEnd(26)} ${String(cur.version).padEnd(14)} total=${c.total} fixable=${c.fixable} grade=${entry.grade} score=${entry.score}`);
}

// A subset run (slugs given) updates only those keys; a full run replaces the file.
let prev = {};
try { prev = JSON.parse(readFileSync(ROOT + 'src/data/security.json', 'utf8')); } catch { /* first run */ }
const merged = only.length ? { ...prev, ...result } : result;
// stable key order so diffs are clean
const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
writeFileSync(ROOT + 'src/data/security.json', JSON.stringify(sorted, null, 2) + '\n');

const totalCves = Object.values(sorted).reduce((a, r) => a + (r.total || 0), 0);
console.error(`\nscanned=${scanned} failed=${failed} | security.json: ${Object.keys(sorted).length} images, ${totalCves} CVEs total`);
