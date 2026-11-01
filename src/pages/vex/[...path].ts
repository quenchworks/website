// GET /vex/<slug>/<date> -> the OpenVEX document whose @id is that URL. An @id is meant to
// resolve to its document; before this route all of them answered 404. Data: src/data/vex.json,
// written by scripts/sync-catalog.mjs from images/apps/*/vex.openvex.json. The static file has
// no extension, so public/_headers sets its Content-Type.
import type { APIRoute } from 'astro';
import vex from '../../data/vex.json';

export const getStaticPaths = () =>
  (vex as { path: string; doc: unknown }[]).map((v) => ({
    params: { path: v.path.replace(/^vex\//, '') },
    props: { doc: v.doc },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.doc, null, 2) + '\n', {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
