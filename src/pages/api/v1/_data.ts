// Shared bits for the v1 JSON API. The leading underscore keeps Astro from
// turning this into a route. ponytail: the catalog is small + the site is a
// static build, so the API is prerendered JSON (full collection + fixed-size
// page files), not a server that reads ?query params. Filter client-side over
// the collection; for live ?query filtering you'd switch these routes to
// prerender:false behind an SSR adapter.
import { images } from '../../../data/images';
import { charts } from '../../../data/charts';
import { roadmap } from '../../../data/roadmap';
import security from '../../../data/security.json';

export const RESOURCES = { images, charts, roadmap } as const;
export type ResourceName = keyof typeof RESOURCES;

export const PER_PAGE = 24;

// ── security ────────────────────────────────────────────────────────────────
// Shared by the rollup (/api/v1/security.json) and the per-image / per-version
// endpoints under /api/v1/security/. security.json carries no scan timestamp, so
// none of these invent a `scannedAt`.
export const SECURITY = security as Record<string, Record<string, any>>;
export const SECURITY_SOURCE = 'QuenchWorks nightly Trivy scan (each published image digest)';

/** One scanned version: counts + grade/score + the deduped per-CVE detail. */
export const securityVersion = (v: Record<string, any>) => ({
  version: v.version,
  tag: v.tag,
  critical: v.critical,
  high: v.high,
  medium: v.medium,
  low: v.low,
  unknown: v.unknown,
  total: v.total,
  fixable: v.fixable,
  grade: v.grade,
  score: v.score,
  cves: v.cves ?? [],
});

export const securityHref = (slug: string) => `/api/v1/security/${slug}.json`;

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
