import type { APIRoute } from 'astro';
import { charts, chartCount } from '../data/charts';
import { availableImages, availableCount } from '../data/images';

// /llms.txt — a machine-readable map of the site for LLMs (https://llmstxt.org).
// Generated from the catalog data so it never drifts from what actually shipped.
const SITE = 'https://quench-works.com';

function byCategory<T extends { category: string; name: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const it of items) {
    (groups.get(it.category) ?? groups.set(it.category, []).get(it.category)!).push(it);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, list]) => [cat, list.sort((a, b) => a.name.localeCompare(b.name))] as const);
}

export const GET: APIRoute = () => {
  const chartList = [...charts];
  const imageList = availableImages;

  const docs = [
    ['Get started', '/docs/get-started', 'Install a chart and pull an image. No repo to add, no account needed.'],
    ['Migrate from Bitnami', '/docs/migrate', 'Swap the registry, translate the values, and move stateful data safely.'],
    ['Verify a signature', '/docs/verify', 'Check an image or chart with cosign keyless (Sigstore).'],
    ['SBOM & provenance', '/docs/sbom', 'Read and verify the SPDX SBOM and SLSA build provenance on any image.'],
    ['Pin by digest', '/docs/pin-by-digest', 'Run exactly what was scanned and signed, with no moving tag.'],
    ['Configuration', '/docs/configuration', 'The shared values surface every chart exposes via the quench-common library.'],
    ['Licensing', '/docs/licensing', 'What is OSI-clean, what is source-available, and the clean alternatives we recommend.'],
  ];

  const lines: string[] = [];
  lines.push('# QuenchWorks');
  lines.push('');
  lines.push(
    `> Free, independent catalog of hardened, 0-CVE container images and signed Helm charts. ` +
      `Built from source on Wolfi, cosign-signed, and pinned by digest, with an SPDX SBOM and a ` +
      `SLSA build-provenance attestation on every image that anyone can verify. ` +
      `${availableCount} hardened, 0-CVE container images (including base/runtime ` +
      `images to build FROM) and ${chartCount} signed charts.`,
  );
  lines.push('');
  lines.push(
    `Everything publishes to GitHub Container Registry (ghcr.io/quenchworks) as OCI artifacts. ` +
      `Charts install from oci://ghcr.io/quenchworks/charts/<name>; images run from ` +
      `ghcr.io/quenchworks/images/<name>. Verify with \`cosign verify\` and \`cosign verify-attestation\`.`,
  );
  lines.push('');

  lines.push('## Docs');
  for (const [name, href, desc] of docs) lines.push(`- [${name}](${SITE}${href}): ${desc}`);
  lines.push('');

  lines.push('## Catalog');
  lines.push(`- [All charts](${SITE}/charts): ${chartCount} hardened, signed Helm charts`);
  lines.push(`- [All images](${SITE}/images): ${availableCount} hardened, 0-CVE container images, including base images to build FROM`);
  lines.push('');

  lines.push('## Helm charts');
  for (const [cat, list] of byCategory(chartList)) {
    lines.push(`### ${cat}`);
    for (const c of list) lines.push(`- [${c.name}](${SITE}/charts/${c.slug}): ${c.summary}`);
    lines.push('');
  }

  lines.push('## Container images');
  for (const [cat, list] of byCategory(imageList)) {
    lines.push(`### ${cat}`);
    for (const i of list) lines.push(`- [${i.name}](${SITE}/images/${i.slug}): ${i.summary}`);
    lines.push('');
  }

  lines.push('## About');
  lines.push(`- [How it works](${SITE}/how-it-works): The build-from-source, sign, distribute pipeline.`);
  lines.push(`- [Security](${SITE}/security): The 0-CVE, signed, digest-pinned security model.`);
  lines.push(`- [Roadmap](${SITE}/roadmap): Apps on deck, with honest licensing notes.`);
  lines.push(`- [About](${SITE}/about): Why QuenchWorks exists and who maintains it.`);
  lines.push(`- [GitHub](https://github.com/quenchworks): Source for the images, charts, and this site.`);
  lines.push(`- [ArtifactHub](https://artifacthub.io/packages/search?org=quenchworks): Charts as a verified publisher.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
