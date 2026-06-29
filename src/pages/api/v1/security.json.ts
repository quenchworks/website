// GET /api/v1/security.json -> live CVE summary: grand total, severity rollup,
// and per-image {critical,high,medium,low,unknown,total,fixable,grade,score}. Sourced
// from the snapshot the nightly Trivy scan writes (scripts/scan-images.mjs), so it
// refreshes on every scan/deploy -- never a hardcoded value, and independent of ArtifactHub.
import type { APIRoute } from 'astro';
import { json } from './_data';
import security from '../../../data/security.json';

const SEVS = ['critical', 'high', 'medium', 'low', 'unknown'] as const;

export const GET: APIRoute = () => {
  const images = security as Record<string, Record<string, any>>;
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
    source: 'QuenchWorks nightly Trivy scan (each published image digest)',
    total,
    fixable, // CVEs with an available fix — these are what a rebuild clears
    bySeverity,
    imagesWithCves: Object.values(images).filter((r) => Number(r.total) > 0).length,
    imagesNeedingRebuild: Object.values(images).filter((r) => Number(r.fixable) > 0).length,
    images,
  });
};
