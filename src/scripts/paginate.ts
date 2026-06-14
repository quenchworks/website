/**
 * Client-side pagination for the catalog list pages (charts / images).
 *
 * Works alongside the existing instant search + tier/category filter:
 * the page computes which `.card` elements match the current query/filter,
 * then this module slices that *filtered* set to the active page, toggles
 * `display` on each card, renders the QW-styled controls, and exposes a
 * live result count. Controls are buttons (no navigation) since filtering
 * happens client-side.
 */

export const PAGE_SIZE = 12;

/** A page-list token: a real page number, or an ellipsis gap. */
type PageToken = number | 'ellipsis';

/**
 * Build the visible page list with first/last always shown, the current
 * page ±delta, and `ellipsis` tokens spanning the gaps. delta=1.
 */
export function generatePageList(current: number, total: number, delta = 1): PageToken[] {
  if (total <= 1) return [1];

  const pages = new Set<number>([1, total]);
  for (let p = current - delta; p <= current + delta; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const out: PageToken[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('ellipsis');
    out.push(p);
    prev = p;
  }
  return out;
}

const CHEVRON_LEFT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
const CHEVRON_RIGHT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

// Shared token classes (QW: mono, uppercase, line/graphite/paper).
const BTN_BASE =
  'inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors duration-200 focus-visible:outline-2';
const BTN_IDLE = 'border-line bg-graphite text-ash hover:border-paper/40 hover:text-paper';
const BTN_ACTIVE = 'border-paper bg-paper text-ink';
const BTN_DISABLED = 'border-line/60 bg-graphite/50 text-ash/40 cursor-not-allowed';

export interface PaginatorOptions {
  /** All paginatable card elements (the full set, unsorted/unfiltered). */
  cards: HTMLElement[];
  /** Container the JS fills with controls. */
  nav: HTMLElement;
  /** Optional live "Showing X–Y of N" element. */
  count?: HTMLElement | null;
  /** Element to scroll to on page change (the search bar), offset below the sticky header. */
  scrollTarget?: HTMLElement | null;
  /** Singular/plural noun for the count label, e.g. ['chart','charts']. */
  noun?: [string, string];
  pageSize?: number;
}

export function createPaginator(opts: PaginatorOptions) {
  const { cards, nav, count, scrollTarget } = opts;
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const [singular, plural] = opts.noun ?? ['item', 'items'];

  let current = 1;
  let filtered: HTMLElement[] = cards.slice();

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }

  function updateCount() {
    if (!count) return;
    const n = filtered.length;
    if (n === 0) {
      count.textContent = '';
      return;
    }
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, n);
    const noun = n === 1 ? singular : plural;
    count.textContent = `Showing ${start}–${end} of ${n} ${noun}`;
  }

  function renderControls() {
    const total = totalPages();
    nav.innerHTML = '';

    if (filtered.length <= pageSize) {
      nav.hidden = true;
      return;
    }
    nav.hidden = false;

    const frag = document.createDocumentFragment();

    const arrow = (dir: 'prev' | 'next', disabled: boolean) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.nav = dir;
      b.className = `${BTN_BASE} ${disabled ? BTN_DISABLED : BTN_IDLE}`;
      b.setAttribute('aria-label', dir === 'prev' ? 'Previous page' : 'Next page');
      if (disabled) b.setAttribute('aria-disabled', 'true');
      b.disabled = disabled;
      b.innerHTML = dir === 'prev' ? CHEVRON_LEFT : CHEVRON_RIGHT;
      return b;
    };

    frag.appendChild(arrow('prev', current === 1));

    for (const token of generatePageList(current, total)) {
      if (token === 'ellipsis') {
        const span = document.createElement('span');
        span.className =
          'inline-flex min-h-9 min-w-9 items-center justify-center font-mono text-xs text-ash/60';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = '…';
        frag.appendChild(span);
        continue;
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.page = String(token);
      const active = token === current;
      b.className = `${BTN_BASE} tabular-nums ${active ? BTN_ACTIVE : BTN_IDLE}`;
      b.setAttribute('aria-label', `Page ${token}`);
      if (active) b.setAttribute('aria-current', 'page');
      b.textContent = String(token);
      frag.appendChild(b);
    }

    frag.appendChild(arrow('next', current === total));

    const status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    status.textContent = `Page ${current} of ${total}`;
    frag.appendChild(status);

    nav.appendChild(frag);
  }

  function applyVisibility() {
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    filtered.forEach((card, i) => {
      card.style.display = i >= start && i < end ? '' : 'none';
    });
  }

  function goTo(page: number, scroll = true) {
    const total = totalPages();
    current = Math.min(Math.max(1, page), total);
    applyVisibility();
    renderControls();
    updateCount();
    if (scroll && scrollTarget) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Scroll the target (the search bar) to just below the sticky header
      // (h-16 = 64px) so search + filter controls stay visible when paging.
      const headerOffset = 80;
      const y = scrollTarget.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  // Delegate clicks on the controls container.
  nav.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('button');
    if (!target || target.disabled) return;
    if (target.dataset.nav === 'prev') goTo(current - 1);
    else if (target.dataset.nav === 'next') goTo(current + 1);
    else if (target.dataset.page) goTo(Number(target.dataset.page));
  });

  return {
    /** Re-paginate with a new filtered set; always resets to page 1. */
    setFiltered(next: HTMLElement[]) {
      filtered = next;
      current = 1;
      applyVisibility();
      renderControls();
      updateCount();
    },
    get count() {
      return filtered.length;
    },
  };
}
