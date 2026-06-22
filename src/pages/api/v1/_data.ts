// Shared bits for the v1 JSON API. The leading underscore keeps Astro from
// turning this into a route. ponytail: the catalog is small + the site is a
// static build, so the API is prerendered JSON (full collection + fixed-size
// page files), not a server that reads ?query params. Filter client-side over
// the collection; for live ?query filtering you'd switch these routes to
// prerender:false behind an SSR adapter.
import { images } from '../../../data/images';
import { charts } from '../../../data/charts';
import { roadmap } from '../../../data/roadmap';

export const RESOURCES = { images, charts, roadmap } as const;
export type ResourceName = keyof typeof RESOURCES;

export const PER_PAGE = 24;

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
