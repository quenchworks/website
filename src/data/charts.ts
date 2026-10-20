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
  imageRepository?: string; // single-app charts only; undefined for umbrella stacks
  imageDigest?: string;
  repositoryID?: string;
  port?: number | string;
  upstream: string;
  chartRef: string; // oci://ghcr.io/quenchworks/charts/<slug>
  caution?: boolean;
  cleanAlternative?: string;
  stack?: boolean; // umbrella chart over several component charts
  components?: string[]; // for stacks: the bundled component chart names
  images?: { name: string; image: string }[]; // every image the chart deploys (stacks bundle many)
  upstreams?: string[]; // for stacks: the bundled components' upstream projects
  valuesKeys?: string[]; // top- and second-level values.yaml keys, for search
}

export const ghcr = 'ghcr.io/quenchworks';

export const charts = data as ChartEntry[];

/** Card count per static catalog page (real URL-based pagination). */
export const PAGE_SIZE = 12;

// Chart versions that get a page: the newest (base page) plus the older ones the
// version switcher lists. A chart is patch-bumped on every image re-pin, so a full
// history ran to ~2,900 pages per locale and pushed dist toward Cloudflare Pages'
// 20,000-file cap. Older version URLs land on 404.html, which forwards to the chart.
export const CHART_VERSION_PAGES = 3;

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
