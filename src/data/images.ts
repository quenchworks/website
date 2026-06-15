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

// The three catalog categories that make up the dedicated /runtimes section.
// These are the base/build images you build FROM, not the service images you
// run, so they live under /runtimes and are EXCLUDED from /images everywhere.
export const RUNTIME_CATEGORIES = ['Language runtime', 'Runtime base', 'Build tool'] as const;

export const isRuntime = (i: ImageEntry): boolean =>
  (RUNTIME_CATEGORIES as readonly string[]).includes(i.category);

/** Service/datastore images shown under /images (runtimes moved to /runtimes). */
export const serviceImages = images.filter((i) => !isRuntime(i));
/** Base/build images shown under /runtimes. */
export const runtimeImages = images.filter(isRuntime);

export const availableImages = serviceImages.filter((i) => i.status === 'available');
export const availableCount = availableImages.length;

export const availableRuntimes = runtimeImages.filter((i) => i.status === 'available');
export const runtimeCount = availableRuntimes.length;

export const imageCategories = [...new Set(serviceImages.map((i) => i.category))].sort();
export const runtimeCategories = [...new Set(runtimeImages.map((i) => i.category))].sort();
export const imageTiers: Tier[] = ['critical', 'standard', 'low'];
export const cautionCount = serviceImages.filter((i) => i.caution).length;

export function imagesByCategory(category: string): ImageEntry[] {
  return serviceImages.filter((i) => i.category === category);
}

export function categoryCounts(): Record<string, number> {
  return serviceImages.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
}
