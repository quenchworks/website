// Shape + ranking for the catalog search suggestions. Imported by BOTH the
// build-time index (src/pages/suggest/[lang].json.ts) and the client-side
// dropdown (CatalogList.astro's script), so the row layout and the match order
// can never drift apart. Same pattern as src/data/grade.ts, which CatalogList
// already imports into its client script for exactly this reason.
//
// Runnable check: `node scripts/check-suggest.mjs`.

/** 0 = image, 1 = chart. */
export type SuggestKind = 0 | 1;

/**
 * One suggestion, POSITIONAL on purpose: 380-odd rows as `{key: value}` objects
 * costs roughly twice the bytes, nearly all of it repeated key names.
 *
 *   [kind, slug, name (0 when identical to slug), category label, summary snippet]
 */
export type SuggestRow = [SuggestKind, string, string | 0, string, string];

/** Enough for a one-line dropdown subtitle, and the haystack for summary matches. */
export const SUGGEST_SNIPPET = 90;

/** One character matches most of the catalog; two is where a suggestion means something. */
export const SUGGEST_MIN = 2;

/** Suggestions shown at once. */
export const SUGGEST_MAX = 8;

/** Most rows omit `name` because it equals `slug`. */
export const suggestName = (r: SuggestRow): string => (r[2] === 0 ? r[1] : r[2]);

/**
 * Match rank for a lowercased query, lower is better:
 * name exact → name prefix → name substring → category → summary. -1 = no match.
 */
export function suggestScore(r: SuggestRow, q: string): number {
  const n = suggestName(r).toLowerCase();
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  if (n.includes(q)) return 2;
  if (r[3].toLowerCase().includes(q)) return 3;
  if (r[4].toLowerCase().includes(q)) return 4;
  return -1;
}

/**
 * The best `limit` matches for `q` (must already be lowercased and trimmed).
 * Ties break, in order:
 *   1. toward `prefer` — the kind of catalog the user is already browsing;
 *   2. shorter name first, i.e. the name closest to what was typed, so
 *      "postgres" leads with PostgreSQL rather than postgres-exporter;
 *   3. alphabetically, so the list never reshuffles between keystrokes.
 */
export function rankSuggestions(
  rows: SuggestRow[],
  q: string,
  prefer: SuggestKind,
  limit = SUGGEST_MAX,
): SuggestRow[] {
  return rows
    .map((r) => ({ r, s: suggestScore(r, q), n: suggestName(r) }))
    .filter((x) => x.s >= 0)
    .sort(
      (a, b) =>
        a.s - b.s ||
        (a.r[0] === prefer ? 0 : 1) - (b.r[0] === prefer ? 0 : 1) ||
        a.n.length - b.n.length ||
        a.n.localeCompare(b.n),
    )
    .slice(0, limit)
    .map((x) => x.r);
}
