// GET /api/v1/security.json -> live CVE summary: grand total, severity rollup,
// and per-image {critical,high,medium,low,unknown,total,fixable,grade,score}. Sourced
// from the snapshot the nightly Trivy scan writes (scripts/scan-images.mjs), so it
// refreshes on every scan/deploy -- never a hardcoded value, and independent of ArtifactHub.
import type { APIRoute } from 'astro';
import { json } from './_data';
import security from '../../../data/security.json';

const SEVS = ['critical', 'high', 'medium', 'low', 'unknown'] as const;

export const GET: APIRoute = () => {
  const images = security as Record<string, Record<string, number>>;
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 };
  let total = 0;
  for (const rec of Object.values(images)) {
    for (const s of SEVS) bySeverity[s] += rec[s] ?? 0;
    total += rec.total ?? 0;
  }
  return json({
    apiVersion: 'v1',
    resource: 'security',
    source: 'ArtifactHub Trivy scan (per chart-pinned image digest)',
    total,
    bySeverity,
    imagesWithCves: Object.values(images).filter((r) => r.total > 0).length,
    images,
  });
};
