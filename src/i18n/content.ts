// i18n for the per-item CATALOG DATA (image/chart summaries, chart descriptions,
// and roadmap notes). The English values live in the data files (images.json,
// charts.json, roadmap.json) and stay the source of truth / fallback; the
// translated strings live in summaries.<lang>.json keyed by slug (images/charts)
// or by name (roadmap).
//
// NOTE: the ar/es strings are INITIAL machine-assisted translations and should
// be reviewed by a native speaker before launch.
import type { Lang } from './ui';
import { defaultLang } from './ui';
import ar from './summaries.ar.json';
import es from './summaries.es.json';

/** The kinds of catalog text we localize. Keys differ per kind:
 *  - images / charts / chartsDescription -> keyed by slug
 *  - roadmap -> keyed by the item `name`
 */
export type ContentKind = 'images' | 'charts' | 'chartsDescription' | 'roadmap';

type Dict = Record<ContentKind, Record<string, string>>;

const dicts: Partial<Record<Lang, Dict>> = {
  ar: ar as Dict,
  es: es as Dict,
};

/**
 * Localized lookup for catalog item text. Returns the translated string for the
 * given language/kind/key, or `fallback` (the English value from the data file)
 * when the language is the default (en), the locale has no dictionary, or the
 * key is missing.
 */
export function localizedSummary(
  lang: Lang,
  kind: ContentKind,
  key: string,
  fallback: string,
): string {
  if (lang === defaultLang) return fallback;
  const dict = dicts[lang];
  return dict?.[kind]?.[key] ?? fallback;
}
