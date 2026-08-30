// The single card-description truncation helper. Card grids (CatalogList,
// CategoryCatalog) all truncate at the same character budget so every card's
// text renders at a uniform length and the grid doesn't go ragged — while the
// full untruncated string (from images.json/charts.json) stays untouched for
// detail pages, <meta description>, and search matching.
//
// 150 is the real catalog's ~p50-p60 summary length (median 164, p25 134
// chars across images+charts): most cards get truncated, short ones pass
// through unclipped, and 150 chars (~25 words) never destroys the meaning of
// a sentence-length summary. Pairs with `line-clamp-3` in the card markup for
// the shorter tail that still fits under budget but wraps past 3 lines.
const CARD_SUMMARY_BUDGET = 150;

export function cardSummary(s: string, budget = CARD_SUMMARY_BUDGET): string {
  if (s.length <= budget) return s;
  const cut = s.slice(0, budget);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
