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
}

export const roadmap = roadmapData as RoadmapItem[];
export const roadmapTotal = roadmap.length;
export const roadmapCategories = [...new Set(roadmap.map((r) => r.category))];

const PRIORITY_ORDER: Record<Priority, number> = { next: 0, planned: 1, exploring: 2 };
export const byPriority = (a: RoadmapItem, b: RoadmapItem) =>
  PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.name.localeCompare(b.name);
