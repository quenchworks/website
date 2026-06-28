// QuenchWorks container images. Data is GENERATED into images.json by
// scripts/sync-catalog.mjs (from ../images/catalog.yaml). Edit the source repo +
// re-run `pnpm sync`, never this file's data. This module adds types + helpers.

import data from './images.json';
import { compareVersionsDesc } from './versions';

export type Tier = 'critical' | 'standard' | 'low';
export type Status = 'available' | 'planned';
export type LicenseClean = 'clean' | 'agpl' | 'caution';

/** One published tag of an image (from catalog.lock.yaml). */
export interface ImageVersion {
  version: string;
  size?: string; // human-readable (e.g. "111.8 MB")
  published?: string; // ISO timestamp
  digest?: string; // multi-arch index digest
}

export interface ImageEntry {
  slug: string;
  name: string;
  category: string;
  summary: string;
  tier: Tier;
  status: Status;
  license: string;
  licenseClean: LicenseClean;
  version?: string; // CSV of published tags, newest first (back-compat)
  versions?: ImageVersion[]; // published tags + per-version metadata
  arches?: string[]; // e.g. ["amd64", "arm64"]
  upstream: string;
  source?: string;
  image: string; // ghcr.io/quenchworks/images/<slug>
  caution?: boolean;
  cleanAlternative?: string;
  /** Editorial note about a current known issue (e.g. a CVE pending an upstream fix). */
  knownIssue?: string;
}

export const ghcr = 'ghcr.io/quenchworks';

export const images = data as ImageEntry[];

/**
 * Canonical published versions for an image: the full X.Y.Z leaf tags, newest
 * first. Floating alias tags (e.g. `10` or `10.0` when `10.0.100` exists) are
 * dropped — they point at the same digest as their full leaf, so showing both
 * is noise and the alias is never the "latest". These drive the version table,
 * the version switcher, and which detail pages get generated.
 */
export function canonicalVersions(vs: ImageVersion[] = []): ImageVersion[] {
  // Real version tags start with a digit; drop junk (selftest, ci-selftest, …).
  const real = vs.filter((v) => /^\d/.test(v.version));
  const tags = real.map((v) => v.version);
  return real
    .filter((v) => !tags.some((t) => t !== v.version && t.startsWith(v.version + '.')))
    .slice()
    .sort((a, b) => compareVersionsDesc(a.version, b.version));
}

export function canonicalTags(vs: ImageVersion[] = []): string[] {
  return canonicalVersions(vs).map((v) => v.version);
}

/** Card count per static catalog page (real URL-based pagination). */
export const PAGE_SIZE = 12;

// The catalog categories that hold base/build images you build FROM (rather
// than service images you run). They still live under /images alongside
// everything else, but isRuntime decides which detail component renders them.
export const RUNTIME_CATEGORIES = ['Language runtime', 'Runtime base', 'Build tool'] as const;

export const isRuntime = (i: ImageEntry): boolean =>
  (RUNTIME_CATEGORIES as readonly string[]).includes(i.category);

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
