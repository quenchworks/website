// The QuenchWorks roadmap: apps on deck, NOT yet built. The data lives in
// roadmap.json (edit that to add/remove entries); this module just types it and
// derives the helpers the roadmap page uses. Apps that have shipped are removed
// from the JSON and surface under "Available now" instead.
//
// licenseClean: clean (OSI permissive/copyleft) | agpl (AGPL/GPL-3) | caution
// (source-available, NOT OSI — carried only with a loud note + a clean alternative).
// priority: next (strongest candidates) | planned | exploring.
import roadmapData from './roadmap.json';

export type LicenseClean = 'clean' | 'agpl' | 'caution';
export type Priority = 'next' | 'planned' | 'exploring';
// What we plan to ship for this entry: a deployable service (image + Helm chart)
// or a base/CLI/sidecar utility that is just an image (like busybox, the exporters).
export type Deliverable = 'image+chart' | 'image';

export interface RoadmapItem {
  name: string;
  category: string;
  license: string;
  licenseClean: LicenseClean;
  note: string;
  priority: Priority;
  deliverable?: Deliverable; // default 'image+chart'
  cleanAlternative?: string;
  // Tested but HELD: the image builds, but the app cannot reach zero fixable CVEs
  // because the app itself pins a dependency below the version that fixes a CVE.
  // We do not ship anything that isn't 0-CVE, so it waits until upstream relaxes
  // the pin or backports the fix. blockedReason states the specific pin conflict.
  blocked?: boolean;
  blockedReason?: string;
}

export const roadmap = roadmapData as RoadmapItem[];
export const roadmapTotal = roadmap.length;
export const roadmapCategories = [...new Set(roadmap.map((r) => r.category))];
export const blockedCount = roadmap.filter((r) => r.blocked).length;
// All held/blocked apps in one name-sorted list for the dedicated "Held" section.
export const blockedList = roadmap.filter((r) => r.blocked).sort((a, b) => a.name.localeCompare(b.name));

const PRIORITY_ORDER: Record<Priority, number> = { next: 0, planned: 1, exploring: 2 };
// Blocked items sort after everything else within their category.
const orderOf = (r: RoadmapItem) => (r.blocked ? 3 : PRIORITY_ORDER[r.priority]);
export const byPriority = (a: RoadmapItem, b: RoadmapItem) =>
  orderOf(a) - orderOf(b) || a.name.localeCompare(b.name);
