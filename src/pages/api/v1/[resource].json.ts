// GET /api/v1/{images,charts,roadmap}.json -> the full collection.
import type { APIRoute } from 'astro';
import { RESOURCES, json, type ResourceName } from './_data';

export const getStaticPaths = () =>
  Object.keys(RESOURCES).map((resource) => ({ params: { resource } }));

export const GET: APIRoute = ({ params }) => {
  const name = params.resource as ResourceName;
  const data = RESOURCES[name];
  return json({ apiVersion: 'v1', resource: name, total: data.length, data });
};
