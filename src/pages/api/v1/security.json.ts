// GET /api/v1/security.json -> live CVE summary: grand total, severity rollup,
// and per-image {critical,high,medium,low,unknown,total,fixable,grade,score}. Sourced
// from the snapshot the nightly Trivy scan writes (scripts/scan-images.mjs), so it
// refreshes on every scan/deploy -- never a hardcoded value, and independent of ArtifactHub.
//
// This rollup stays COUNTS-ONLY: the scan now records per-CVE detail, but inlining every
// CVE for 188 images would turn a ~150KB summary into a multi-MB download for the badge
// and dashboard consumers that only ever read the numbers. Each image record instead
// carries an `href` to its full detail at /api/v1/security/{slug}.json (also indexed at
// /api/v1/security/index.json). Every previously published field is unchanged.
import type { APIRoute } from 'astro';
import { json, SECURITY, SECURITY_SOURCE, securityHref } from './_data';

const SEVS = ['critical', 'high', 'medium', 'low', 'unknown'] as const;

/** Drop the per-CVE detail (top level and per version), add the detail href. */
const countsOnly = (slug: string, rec: Record<string, any>) => {
  const { cves, versions, ...counts } = rec;
  return {
    ...counts,
    versions: (versions ?? []).map(({ cves: _drop, ...v }: Record<string, any>) => v),
    href: securityHref(slug),
  };
};

export const GET: APIRoute = () => {
  const images = SECURITY;
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 };
  let total = 0, fixable = 0;
  for (const rec of Object.values(images)) {
    for (const s of SEVS) bySeverity[s] += Number(rec[s] ?? 0);
    total += Number(rec.total ?? 0);
    fixable += Number(rec.fixable ?? 0);
  }
  return json({
    apiVersion: 'v1',
    resource: 'security',
    source: SECURITY_SOURCE,
    total,
    fixable, // CVEs with an available fix — these are what a rebuild clears
    bySeverity,
    imagesWithCves: Object.values(images).filter((r) => Number(r.total) > 0).length,
    imagesNeedingRebuild: Object.values(images).filter((r) => Number(r.fixable) > 0).length,
    images: Object.fromEntries(Object.entries(images).map(([slug, rec]) => [slug, countsOnly(slug, rec)])),
  });
};
