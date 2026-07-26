// GET /api/v1/security/{slug}.json -> ONE image's full CVE detail: the latest scanned
// version plus every published version, each with its own deduped `cves[]` (id, severity,
// package, installed/fixed version, title, advisory URL, affected targets). Sourced from
// the nightly Trivy scan snapshot (scripts/scan-images.mjs).
//
// Prerendered (no SSR adapter — see _data.ts), so the slug is a static path built from
// security.json's keys. An unscanned slug has no path and therefore 404s: correct, we
// don't fabricate an empty record.
import type { APIRoute } from 'astro';
import { json, SECURITY, SECURITY_SOURCE, securityVersion } from '../_data';

export function getStaticPaths() {
  return Object.keys(SECURITY).map((slug) => ({ params: { slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const rec = SECURITY[slug];
  const versions: Record<string, any>[] = rec.versions ?? [];
  return json({
    apiVersion: 'v1',
    resource: 'security',
    slug,
    image: rec.image,
    source: SECURITY_SOURCE,
    latest: securityVersion(rec), // the top-level record mirrors the newest version
    versions: versions.map(securityVersion),
  });
};
