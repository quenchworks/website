// QuenchWorks container images. Data is GENERATED into images.json by
// scripts/sync-catalog.mjs (from ../images/catalog.yaml). Edit the source repo +
// re-run `pnpm sync`, never this file's data. This module adds types + helpers.

import data from './images.json';

export type Tier = 'critical' | 'standard' | 'low';
export type Status = 'available' | 'planned';
export type LicenseClean = 'clean' | 'agpl' | 'caution';

export interface ImageEntry {
  slug: string;
  name: string;
  category: string;
  summary: string;
  tier: Tier;
  status: Status;
  license: string;
  licenseClean: LicenseClean;
  version?: string; // app version
  upstream: string;
  source?: string;
  image: string; // ghcr.io/quenchworks/images/<slug>
  caution?: boolean;
  cleanAlternative?: string;
}

export const ghcr = 'ghcr.io/quenchworks';

export const images = data as ImageEntry[];

/** Card count per static catalog page (real URL-based pagination). */
export const PAGE_SIZE = 12;

export const availableImages = images.filter((i) => i.status === 'available');
export const availableCount = availableImages.length;

export const imageCategories = [...new Set(images.map((i) => i.category))].sort();
export const imageTiers: Tier[] = ['critical', 'standard', 'low'];
export const cautionCount = images.filter((i) => i.caution).length;

export function imagesByCategory(category: string): ImageEntry[] {
  return images.filter((i) => i.category === category);
}

export function categoryCounts(): Record<string, number> {
  return images.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
}
