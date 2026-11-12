// /stacks is generated from the same catalog data as /charts (charts.json, written by
// scripts/sync-catalog.mjs from each chart's Chart.yaml): a stack is a chart marked `stack`, its
// components are its chart dependencies, its group comes from its ArtifactHub category, and it
// installs CRDs when it or a component carries the ArtifactHub operator flag or declares CRDs. A new stack chart
// appears here with no edit to this file. Only the translated one-line pitches stay per locale.
import chartsData from './charts.json';

export type StackGroup = 'observability' | 'data' | 'security' | 'platform' | 'ai';

export type Stack = {
  slug: string;
  name: string;
  /** Display names of the component charts, in dependency order. */
  components: string[];
  /** The component charts' slugs, in the same order (for links). */
  componentSlugs: string[];
  /** Filter facet on /stacks. */
  group: StackGroup;
  /** Built around a controller that installs CRDs (the rest are plain Helm). */
  operator?: boolean;
};

export const STACK_GROUPS: StackGroup[] = ['observability', 'data', 'security', 'platform', 'ai'];

// ArtifactHub category -> /stacks filter group.
const GROUP: Record<string, StackGroup> = {
  'monitoring-logging': 'observability',
  database: 'data',
  storage: 'data',
  'streaming-messaging': 'data',
  security: 'security',
  'ai-machine-learning': 'ai',
};

type Entry = { slug: string; name: string; stack?: boolean; operator?: boolean; crds?: string[]; ahCategory?: string; components?: string[] };
const charts = (Array.isArray(chartsData) ? chartsData : (chartsData as { charts: Entry[] }).charts) as Entry[];
const bySlug = new Map(charts.map((c) => [c.slug, c]));

export const STACKS: Stack[] = charts
  .filter((c) => c.stack)
  .map((c) => {
    const componentSlugs = c.components ?? [];
    return {
      slug: c.slug,
      name: c.name,
      components: componentSlugs.map((k) => bySlug.get(k)?.name ?? k),
      componentSlugs,
      group: GROUP[c.ahCategory ?? ''] ?? 'platform',
      operator: [c, ...componentSlugs.map((k) => bySlug.get(k))].some((e) => e?.operator || e?.crds) || undefined,
    };
  })
  .sort((a, b) => STACK_GROUPS.indexOf(a.group) - STACK_GROUPS.indexOf(b.group) || a.name.localeCompare(b.name));
