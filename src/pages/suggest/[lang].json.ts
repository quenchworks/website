// GET /suggest/{en,ar,es}.json — the build-time autocomplete index behind the
// catalog search box (CatalogList.astro). Covers BOTH kinds, so typing "redis"
// on /images also surfaces the redis chart.
//
// ponytail: this is a separate, lazily-fetched file rather than another inline
// blob. The catalog pages already embed their own kind's full dataset for
// filtering; adding 380-odd cross-kind rows to every one of those pages would be
// the wrong trade. Fetched once, on first use, then browser-cached (~10 KB gzip).
//
// One file per locale, because summaries and category labels are localized.
// The row layout + ranking live in src/data/suggest.ts, shared with the client.
import type { APIRoute } from 'astro';
import { availableImages } from '../../data/images';
import { charts } from '../../data/charts';
import { languages, type Lang } from '../../i18n/ui';
import { localizedSummary } from '../../i18n/content';
import { categoryName } from '../../i18n/categories';
import { cardSummary } from '../../data/truncate';
import { SUGGEST_SNIPPET, type SuggestKind, type SuggestRow } from '../../data/suggest';

export const getStaticPaths = () =>
  Object.keys(languages).map((lang) => ({ params: { lang } }));

type Item = { slug: string; name: string; category: string; summary: string };

export const GET: APIRoute = ({ params }) => {
  const lang = params.lang as Lang;

  const row = (kind: SuggestKind, e: Item): SuggestRow => [
    kind,
    e.slug,
    e.name === e.slug ? 0 : e.name,
    categoryName(lang, e.category),
    cardSummary(
      localizedSummary(lang, kind === 0 ? 'images' : 'charts', e.slug, e.summary),
      SUGGEST_SNIPPET,
    ),
  ];

  // Only entries that actually HAVE a detail page to land on: a planned image
  // renders as a non-link card and gets no route, so it would suggest a 404.
  const rows: SuggestRow[] = [
    ...(availableImages as Item[]).map((e) => row(0, e)),
    ...(charts as unknown as Item[]).map((e) => row(1, e)),
  ];

  return new Response(JSON.stringify(rows), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
