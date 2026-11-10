#!/usr/bin/env node
// Every ghcr.io/quenchworks image tag and chart `--version` in the docs must exist on GHCR.
// The docs pointed at redis chart 0.0.5/0.0.6 for weeks; neither was ever published, so every
// helm and cosign example failed. Anonymous pull tokens are enough: the packages are public.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dirs = ['src/content/docs', 'src/content/docs-es', 'src/content/docs-ar'];
const refs = new Set();
for (const d of dirs) {
  for (const f of readdirSync(d).filter((f) => /\.mdx?$/.test(f))) {
    const s = readFileSync(join(d, f), 'utf8');
    // image or chart ref with a tag: ghcr.io/quenchworks/images/redis:8.10.3
    for (const m of s.matchAll(/ghcr\.io\/quenchworks\/((?:images|charts)\/[a-z0-9-]+):([A-Za-z0-9._-]+)/g)) refs.add(`${m[1]}:${m[2]}`);
    // oci://ghcr.io/quenchworks/charts/redis --version 0.0.36
    for (const m of s.matchAll(/oci:\/\/ghcr\.io\/quenchworks\/(charts\/[a-z0-9-]+)\s+--version\s+([0-9][0-9A-Za-z.+-]*)/g)) refs.add(`${m[1]}:${m[2]}`);
  }
}

async function exists(ref) {
  const [repo, tag] = ref.split(':');
  const tok = await fetch(`https://ghcr.io/token?scope=repository:quenchworks/${repo}:pull`).then((r) => r.json());
  const r = await fetch(`https://ghcr.io/v2/quenchworks/${repo}/manifests/${tag}`, {
    method: 'HEAD',
    headers: {
      Authorization: `Bearer ${tok.token}`,
      Accept: 'application/vnd.oci.image.index.v1+json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.docker.distribution.manifest.v2+json',
    },
  });
  return r.status === 200;
}

const missing = [];
for (const ref of [...refs].sort()) if (!(await exists(ref))) missing.push(ref);
if (missing.length) {
  console.error(`${missing.length} of ${refs.size} docs refs are not on GHCR:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`ok, ${refs.size} docs refs resolve on GHCR`);
