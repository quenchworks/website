// sync-security.mjs — snapshot ArtifactHub's per-package Trivy summary into
// src/data/security.json, so the build reads a committed file instead of hitting
// ArtifactHub live (the build's parallel page renders get rate-limited -> 429 ->
// blank CVE data). Refresh by re-running this (wired into `pnpm sync`).
//
//   node scripts/sync-security.mjs
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://artifacthub.io/api/v1';
const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'security.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// AH caps search `limit` at 60, so paginate by offset to cover all packages.
async function fetchPage(offset) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(`${API}/packages/search?ts_query_web=quenchworks&kind=0&limit=60&offset=${offset}`, {
        headers: { accept: 'application/json' },
      });
      if (res.ok) return (await res.json()).packages ?? [];
      console.warn(`offset ${offset} attempt ${attempt}: HTTP ${res.status}`);
    } catch (e) {
      console.warn(`offset ${offset} attempt ${attempt}: ${e.message}`);
    }
    await sleep(Math.min(60000, 5000 * attempt));
  }
  throw new Error(`ArtifactHub unreachable at offset ${offset}`);
}

async function fetchSearch() {
  const all = [];
  for (let offset = 0; offset < 180; offset += 60) {
    const page = await fetchPage(offset);
    all.push(...page);
    if (page.length < 60) break; // last page
    await sleep(1500); // be gentle between pages
  }
  return all;
}

const pkgs = await fetchSearch();
const data = {};
for (const p of pkgs) {
  const s = p.security_report_summary;
  if (!s) continue;
  const rec = {
    critical: s.critical ?? 0,
    high: s.high ?? 0,
    medium: s.medium ?? 0,
    low: s.low ?? 0,
    unknown: s.unknown ?? 0,
  };
  rec.total = rec.critical + rec.high + rec.medium + rec.low + rec.unknown;
  data[p.name] = rec;
}
writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
const total = Object.values(data).reduce((a, r) => a + r.total, 0);
console.log(`wrote security.json: ${Object.keys(data).length} packages, ${total} CVEs total`);
