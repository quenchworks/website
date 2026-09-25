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
}

export const updatesChecked: string = updatesData.checked;
export const updates = updatesData.items as UpdateItem[];
const order: UpdateStatus[] = ['building', 'queued', 'shipped', 'held', 'skipped'];
export const updatesSorted = [...updates].sort(
  (a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.app.localeCompare(b.app),
);
export const updatesOpen = updates.filter((u) => u.status === 'queued' || u.status === 'building').length;
