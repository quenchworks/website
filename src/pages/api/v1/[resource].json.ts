// GET /api/v1/{images,charts,roadmap,updates}.json -> the full collection.
// images/charts carry a live `security` rollup ({critical,high,medium,low,
// unknown,total}) per entry, from the ArtifactHub snapshot (security.json).
import type { APIRoute } from 'astro';
import { RESOURCES, UPDATES_CHECKED, json, type ResourceName } from './_data';
import security from '../../../data/security.json';

export const getStaticPaths = () =>
  Object.keys(RESOURCES).map((resource) => ({ params: { resource } }));

const sec = security as Record<string, Record<string, unknown>>;

export const GET: APIRoute = ({ params }) => {
  const name = params.resource as ResourceName;
  let data: any[] = RESOURCES[name] as any[];
  if (name === 'images' || name === 'charts') {
    data = data.map((e: any) => ({ ...e, security: sec[e.slug] ?? null }));
  }
  const checked = name === 'updates' ? { checked: UPDATES_CHECKED } : {};
  return json({ apiVersion: 'v1', resource: name, ...checked, total: data.length, data });
};
