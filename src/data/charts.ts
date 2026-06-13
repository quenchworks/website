// QuenchWorks Helm charts. Data is GENERATED into charts.json by
// scripts/sync-catalog.mjs (from ../charts/quench/<app>/*). Edit the source repo +
// re-run `pnpm sync`, never this file's data. This module adds types + helpers.

import data from './charts.json';

export type Tier = 'critical' | 'standard' | 'low';
export type LicenseClean = 'clean' | 'agpl' | 'caution';

export interface ChartEntry {
  slug: string;
  name: string;
  category: string;
  summary: string;
  tier: Tier;
  license: string;
  licenseClean: LicenseClean;
  chartVersion?: string;
  appVersion?: string;
  description?: string;
  imageRepository: string;
  imageDigest?: string;
  repositoryID?: string;
  port?: number | string;
  upstream: string;
  chartRef: string; // oci://ghcr.io/quenchworks/charts/<slug>
  caution?: boolean;
  cleanAlternative?: string;
}

export const ghcr = 'ghcr.io/quenchworks';

export const charts = data as ChartEntry[];

export const chartCount = charts.length;
export const chartCategories = [...new Set(charts.map((c) => c.category))].sort();
export const chartTiers: Tier[] = ['critical', 'standard', 'low'];
export const cautionCount = charts.filter((c) => c.caution).length;

export function chartsByCategory(category: string): ChartEntry[] {
  return charts.filter((c) => c.category === category);
}

export function categoryCounts(): Record<string, number> {
  return charts.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1;
    return acc;
  }, {});
}
