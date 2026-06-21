// gen-dockerfiles.mjs — regenerate src/data/dockerfiles/<slug>/<version>.dockerfile
// so there is one file per CANONICAL published version of each runtime, each
// pinning full-version FROM tags (its own image + cross-referenced bases like
// jre/node/static). Bodies differ only by the pinned tags, so one on-disk file
// is the template and the rest are re-stamped from it. Run after sync-catalog
// (it reads src/data/images.json):  node scripts/gen-dockerfiles.mjs

import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dfDir = resolve(root, 'src/data/dockerfiles');
const images = JSON.parse(readFileSync(resolve(root, 'src/data/images.json'), 'utf8'));

function cmp(a, b) {
  const pa = a.split('.'), pb = b.split('.');
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] === undefined ? -Infinity : Number(pa[i]);
    const nb = pb[i] === undefined ? -Infinity : Number(pb[i]);
    const an = Number.isNaN(na) ? null : na, bn = Number.isNaN(nb) ? null : nb;
    if (an === null && bn === null) { if (pa[i] === pb[i]) continue; return pa[i] < pb[i] ? 1 : -1; }
    if (an === null) return 1; if (bn === null) return -1; if (an !== bn) return bn - an;
  }
  return 0;
}
// Canonical published versions for a slug: real (digit-led) full-version leaves,
// newest first; alias tags (e.g. "21" when "21.0.11" exists) dropped.
function canon(slug) {
  const all = images.find((i) => i.slug === slug)?.versions ?? [];
  const vs = all.filter((v) => /^\d/.test(v.version));
  const tags = vs.map((v) => v.version);
  return vs.filter((v) => !tags.some((t) => t !== v.version && t.startsWith(v.version + '.')))
    .map((v) => v.version).sort(cmp);
}
// Cross-referenced base image's version matching selfVer's major line (jdk 21 ->
// jre 21), else that image's newest canonical.
function cross(img, self) {
  const t = canon(img); if (!t.length) return null;
  const M = self.split('.')[0];
  return t.find((x) => x.split('.')[0] === M) ?? t[0];
}
const RE = /(ghcr\.io\/quenchworks\/images\/([a-z0-9-]+):)([^\s"']+)/g;
const render = (slug, body, ver) => body.replace(RE, (_m, p, img) => p + (img === slug ? ver : (cross(img, ver) ?? ver)));

let n = 0;
for (const slug of readdirSync(dfDir)) {
  const dir = resolve(dfDir, slug);
  const files = readdirSync(dir).filter((f) => f.endsWith('.dockerfile'));
  if (!files.length) continue;
  const onDisk = files.map((f) => f.replace(/\.dockerfile$/, '')).sort(cmp);
  const template = readFileSync(resolve(dir, onDisk[0] + '.dockerfile'), 'utf8');
  // One file per canonical version; fall back to the on-disk tag when the
  // catalog has none (planned runtimes, or static's :latest-only image).
  const versions = canon(slug).length ? canon(slug) : [onDisk[0]];
  for (const f of files) rmSync(resolve(dir, f));
  for (const ver of versions) writeFileSync(resolve(dir, ver + '.dockerfile'), render(slug, template, ver));
  console.log(`  ${slug}: ${versions.join(', ')}`);
  n++;
}
console.log(`regenerated ${n} runtime dockerfiles`);
