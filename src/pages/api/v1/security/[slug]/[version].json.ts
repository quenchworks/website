// GET /api/v1/security/{slug}/{version}.json -> ONE version of ONE image: its counts,
// grade/score, and full deduped `cves[]`. Prerendered over every (slug, version) pair in
// security.json; versions containing dots (3.7.0, 1.0.0_beta11_p1) are written verbatim
// into the filename, so the .json extension still lands. A chart-pinned digest's version is
// `chart:<chart>`; Node 26 refuses a ":" in an output path ("The URL must be of scheme file"),
// so the file name uses `chart-<chart>`.
import type { APIRoute } from 'astro';
import { json, SECURITY, SECURITY_SOURCE, securityVersion, securityHref } from '../../_data';

const segment = (version: unknown) => String(version).replace(/:/g, '-');

export function getStaticPaths() {
  return Object.entries(SECURITY).flatMap(([slug, rec]) =>
    (rec.versions ?? []).map((v: Record<string, any>) => ({ params: { slug, version: segment(v.version) } })),
  );
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const rec = SECURITY[slug];
  const v = (rec.versions ?? []).find((x: Record<string, any>) => segment(x.version) === params.version);
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
