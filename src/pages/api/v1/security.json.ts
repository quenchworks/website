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
import { supportOf } from '../../../data/support';

const SEVS = ['critical', 'high', 'medium', 'low', 'unknown'] as const;

/** Drop the per-CVE detail (top level and per version), add the detail href. */
const countsOnly = (slug: string, rec: Record<string, any>) => {
  const { cves, versions, ...counts } = rec;
  return {
    ...counts,
    // held / eol: published but not updated in the next scheduled release; not in the totals.
    support: supportOf(slug)?.state ?? null,
    versions: (versions ?? []).map(({ cves: _drop, ...v }: Record<string, any>) => v),
    href: securityHref(slug),
  };
};

export const GET: APIRoute = () => {
  const images = SECURITY;
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 };
  let total = 0, fixable = 0;
  // Held and end-of-life images are reported under `excluded`, not in the totals: their next
  // scheduled release does not rebuild them, so their findings are not work a rebuild clears.
  const excluded = { images: [] as string[], total: 0, fixable: 0 };
  for (const [slug, rec] of Object.entries(images)) {
    if (supportOf(slug)) {
      excluded.images.push(slug);
      excluded.total += Number(rec.total ?? 0);
      excluded.fixable += Number(rec.fixable ?? 0);
      continue;
    }
    for (const s of SEVS) bySeverity[s] += Number(rec[s] ?? 0);
    total += Number(rec.total ?? 0);
    fixable += Number(rec.fixable ?? 0);
  }
  const counted = Object.entries(images).filter(([slug]) => !supportOf(slug)).map(([, r]) => r);
  return json({
    apiVersion: 'v1',
    resource: 'security',
    source: SECURITY_SOURCE,
    total,
    fixable, // CVEs with an available fix — these are what a rebuild clears
    bySeverity,
    imagesWithCves: counted.filter((r) => Number(r.total) > 0).length,
    imagesNeedingRebuild: counted.filter((r) => Number(r.fixable) > 0).length,
    excluded, // held / end-of-life images: listed per image below, kept out of the numbers above
    images: Object.fromEntries(Object.entries(images).map(([slug, rec]) => [slug, countsOnly(slug, rec)])),
  });
};
