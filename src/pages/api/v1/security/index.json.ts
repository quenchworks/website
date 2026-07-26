// GET /api/v1/security/index.json -> discovery index for the per-image endpoints:
// every scanned image with its headline numbers and the href to its full CVE detail.
// Counts only here; the detail lives one hop away at /api/v1/security/{slug}.json.
import type { APIRoute } from 'astro';
import { json, SECURITY, SECURITY_SOURCE, securityHref } from '../_data';

export const GET: APIRoute = () => {
  const entries = Object.entries(SECURITY);
  return json({
    apiVersion: 'v1',
    resource: 'security',
    source: SECURITY_SOURCE,
    count: entries.length,
    images: entries.map(([slug, rec]) => ({
      slug,
      image: rec.image,
      grade: rec.grade,
      total: rec.total,
      fixable: rec.fixable,
      href: securityHref(slug),
    })),
  });
};
