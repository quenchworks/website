// Resolve the free-text `cleanAlternative` note on a caution entry into concrete
// in-catalog slugs we can link to. The note is a human sentence (e.g. "Valkey
// (BSD-3-Clause) -- the truly-open Redis-compatible cache."), so we scan it for
// known product names and map each to its catalog slug. Only slugs that exist as
// a real chart/image page are surfaced as links; the prose note is kept verbatim.

import { images } from './images';
import { charts } from './charts';

// Product name (as it appears in the note) -> catalog slug.
// Order matters: longer/more-specific names first so they win the scan.
const NAME_TO_SLUG: [name: string, slug: string][] = [
  ['DocumentDB', 'documentdb'],
  ['FerretDB', 'ferretdb'],
  ['OpenSearch', 'opensearch'],
  ['PostgreSQL', 'postgresql'],
  ['Valkey', 'valkey'],
];

export interface AltLink {
  name: string;
  slug: string;
  hasChart: boolean;
  hasImage: boolean;
}

const chartSlugs = new Set(charts.map((c) => c.slug));
const imageSlugs = new Set(images.filter((i) => i.status === 'available').map((i) => i.slug));

// Pull every recognised product name out of a cleanAlternative note, deduped and
// in the order they appear in the sentence.
export function resolveAlternatives(note: string | undefined): AltLink[] {
  if (!note) return [];
  const found: { slug: string; name: string; at: number }[] = [];
  const seen = new Set<string>();
  for (const [name, slug] of NAME_TO_SLUG) {
    const at = note.indexOf(name);
    if (at === -1 || seen.has(slug)) continue;
    if (!chartSlugs.has(slug) && !imageSlugs.has(slug)) continue;
    seen.add(slug);
    found.push({ slug, name, at });
  }
  return found
    .sort((a, b) => a.at - b.at)
    .map(({ slug, name }) => ({
      name,
      slug,
      hasChart: chartSlugs.has(slug),
      hasImage: imageSlugs.has(slug),
    }));
}
