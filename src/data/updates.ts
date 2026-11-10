// The version-update queue from the last scripts/check-updates.py run in the images
// repo: which catalog apps have a newer upstream release and where each one stands.
// Edit updates.json as updates ship; the roadmap page renders it.
import updatesData from './updates.json';

export type UpdateStatus = 'queued' | 'building' | 'shipped' | 'held' | 'skipped';

export interface UpdateItem {
  app: string;
  from: string;
  to: string;
  status: UpdateStatus;
  note?: string;
  /** YYYY-MM-DD the update shipped; a shipped item is listed for one day after it. */
  shipped?: string;
}

export const updatesChecked: string = updatesData.checked;
// Shipped items drop out one day after their `shipped` date (or at once without one), so the
// queue shows what is still moving. Evaluated at build time; the site rebuilds at least daily.
const DAY_MS = 24 * 60 * 60 * 1000;
const builtAt = Date.now();
export const updates = (updatesData.items as UpdateItem[]).filter(
  (u) => u.status !== 'shipped' || (u.shipped !== undefined && builtAt - Date.parse(u.shipped) < 2 * DAY_MS),
);
const order: UpdateStatus[] = ['building', 'queued', 'shipped', 'held', 'skipped'];
export const updatesSorted = [...updates].sort(
  (a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.app.localeCompare(b.app),
);
export const updatesOpen = updates.filter((u) => u.status === 'queued' || u.status === 'building').length;
