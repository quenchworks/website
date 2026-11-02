// Images (and their charts) we publish but do not update. Written by scripts/sync-catalog.mjs into
// blocked-apps.json from images/apps/<slug>/build.conf: BLOCKED=1 is `held` (a CVE or upstream
// wall we are waiting out), EOL=1 is `eol` (support dropped). Neither gets a new build in the
// next scheduled release, so their CVEs are listed on the image but left out of every catalog
// total: counting them would read as work a rebuild can do.
// ponytail: charts are matched by slug (every chart shares its image's slug today); a chart whose
// image has another name needs an explicit map here.
import list from './blocked-apps.json';

export type SupportState = 'held' | 'eol';
export interface Support {
  state: SupportState;
  measured: string | null;
  status: string;
}

export const SUPPORT: Record<string, Support> = Object.fromEntries(
  (list as Array<{ slug: string; state?: SupportState; measured: string | null; status: string }>).map((e) => [
    e.slug,
    { state: e.state ?? 'held', measured: e.measured, status: e.status },
  ]),
);

export const supportOf = (slug: string): Support | undefined => SUPPORT[slug];
/** True when an image's CVEs belong in catalog totals (it is updated on schedule). */
export const counted = (slug: string): boolean => !SUPPORT[slug];

// Label and notice text live in src/i18n/ui.ts: support.held / support.eol and support.heldNote /
// support.eolNote, keyed by state.
export const supportKey = (state: SupportState) => ({ label: `support.${state}` as const, note: `support.${state}Note` as const });
