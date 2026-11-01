// OpenVEX documents the images ship (synced from images/apps/*/vex.openvex.json by
// scripts/sync-catalog.mjs). Used by the /vex index, the per-image pages and the
// raw documents served at each @id (src/pages/vex/[...path].ts).
import raw from './vex.json';
import images from './images.json';
import { PAGE_SIZE } from './images';

export interface VexStatement {
  vulnerability: { name: string };
  products: { '@id': string }[];
  status: string;
  justification?: string;
  impact_statement?: string;
  action_statement?: string;
}
export interface VexEntry {
  slug: string;
  name: string;
  path: string;
  id: string;
  date: string;
  statements: VexStatement[];
}

const names = new Map((images as { slug: string; name: string }[]).map((i) => [i.slug, i.name]));

export const vex: VexEntry[] = (raw as { slug: string; path: string; doc: any }[]).map((v) => ({
  slug: v.slug,
  name: names.get(v.slug) ?? v.slug,
  path: v.path,
  id: v.doc['@id'],
  date: String(v.doc.timestamp ?? '').slice(0, 10),
  statements: v.doc.statements ?? [],
}));

// Same 12-card pages as /images and /charts: page 1 at /vex, pages 2..N at /vex/page/<n>.
export const vexPages = Math.max(1, Math.ceil(vex.length / PAGE_SIZE));

export const statementCount = vex.reduce((n, v) => n + v.statements.length, 0);

/** "pkg:cargo/russh@0.64.1" -> "russh 0.64.1"; anything else as written. */
export const productLabel = (purl: string) => {
  const m = purl.match(/^pkg:[^/]+\/(?:[^@]+\/)?([^@/]+)@(.+)$/);
  return m ? `${decodeURIComponent(m[1])} ${decodeURIComponent(m[2])}` : purl;
};
