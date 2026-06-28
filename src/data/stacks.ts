// Single source of truth for the curated umbrella stacks shown on /stacks.
// Only the slug/name/components are here — they are language-neutral (proper
// nouns + the chart slug). The per-locale value-prop sentence lives in each
// locale's page, keyed by slug, so prose stays translatable without copying
// this structural data into every locale file.
export type Stack = {
  slug: string;
  name: string;
  components: string[];
};

export const STACKS: Stack[] = [
  {
    slug: 'observability-stack',
    name: 'Observability Stack',
    components: ['Prometheus', 'Grafana', 'Alertmanager', 'kube-state-metrics', 'node-exporter', 'cAdvisor'],
  },
  {
    slug: 'lgtm-stack',
    name: 'LGTM Stack',
    components: ['Loki', 'Grafana', 'Tempo', 'VictoriaMetrics', 'OpenTelemetry Collector', 'Alertmanager'],
  },
  {
    slug: 'logging-stack',
    name: 'Logging Stack',
    components: ['Loki', 'Grafana', 'Vector'],
  },
  {
    slug: 'tracing-stack',
    name: 'Tracing Stack',
    components: ['Tempo', 'Grafana', 'OpenTelemetry Collector'],
  },
  {
    slug: 'identity-stack',
    name: 'Identity Stack',
    components: ['Keycloak', 'PostgreSQL', 'oauth2-proxy'],
  },
];
