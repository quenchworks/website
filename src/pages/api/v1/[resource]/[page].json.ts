// GET /api/v1/{resource}/{page}.json -> one page of the collection (perPage=24)
// with a meta + links envelope. Pages are prerendered, so the page number lives
// in the path (/api/v1/images/2.json), not a ?page query.
import type { APIRoute } from 'astro';
import { RESOURCES, PER_PAGE, json, type ResourceName } from '../_data';

export function getStaticPaths() {
  return Object.entries(RESOURCES).flatMap(([resource, data]) => {
    const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
    return Array.from({ length: totalPages }, (_, i) => ({
      params: { resource, page: String(i + 1) },
    }));
  });
}

export const GET: APIRoute = ({ params }) => {
  const name = params.resource as ResourceName;
  const data = RESOURCES[name];
  const page = Number(params.page);
  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const base = `/api/v1/${name}`;
  const pg = (p: number) => `${base}/${p}.json`;
  return json({
    apiVersion: 'v1',
    resource: name,
    page,
    perPage: PER_PAGE,
    total: data.length,
    totalPages,
    links: {
      self: pg(page),
      first: pg(1),
      last: pg(totalPages),
      prev: page > 1 ? pg(page - 1) : null,
      next: page < totalPages ? pg(page + 1) : null,
      collection: `${base}.json`,
    },
    data: data.slice(start, start + PER_PAGE),
  });
};
