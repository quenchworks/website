// GET /api/v1/security/{slug}/{version}.json -> ONE version of ONE image: its counts,
// grade/score, and full deduped `cves[]`. Prerendered over every (slug, version) pair in
// security.json; versions containing dots (3.7.0, 1.0.0_beta11_p1) are written verbatim
// into the filename, so the .json extension still lands.
import type { APIRoute } from 'astro';
import { json, SECURITY, SECURITY_SOURCE, securityVersion, securityHref } from '../../_data';

export function getStaticPaths() {
  return Object.entries(SECURITY).flatMap(([slug, rec]) =>
    (rec.versions ?? []).map((v: Record<string, any>) => ({ params: { slug, version: String(v.version) } })),
  );
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const rec = SECURITY[slug];
  const v = (rec.versions ?? []).find((x: Record<string, any>) => String(x.version) === params.version);
  return json({
    apiVersion: 'v1',
    resource: 'security',
    slug,
    image: rec.image,
    source: SECURITY_SOURCE,
    links: { image: securityHref(slug) },
    ...securityVersion(v),
  });
};
