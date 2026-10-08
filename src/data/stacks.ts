// Single source of truth for the curated umbrella stacks shown on /stacks.
// Only the slug/name/components are here — they are language-neutral (proper
// nouns + the chart slug). The per-locale value-prop sentence lives in each
// locale's page, keyed by slug, so prose stays translatable without copying
// this structural data into every locale file.
export type StackGroup = 'observability' | 'data' | 'security' | 'platform' | 'ai';

export type Stack = {
  slug: string;
  name: string;
  components: string[];
  /** Filter facet on /stacks. */
  group: StackGroup;
  /** Built around a controller that installs CRDs (the rest are plain Helm). */
  operator?: boolean;
};

export const STACK_GROUPS: StackGroup[] = ['observability', 'data', 'security', 'platform', 'ai'];

export const STACKS: Stack[] = [
  {
    slug: 'observability-stack',
    name: 'Observability Stack',
    components: ['Prometheus', 'Grafana', 'Alertmanager', 'kube-state-metrics', 'node-exporter', 'cAdvisor'],
    group: 'observability',
  },
  {
    slug: 'lgtm-stack',
    name: 'LGTM Stack',
    components: ['Loki', 'Grafana', 'Tempo', 'VictoriaMetrics', 'OpenTelemetry Collector', 'Alertmanager'],
    group: 'observability',
  },
  {
    slug: 'logging-stack',
    name: 'Logging Stack',
    components: ['Loki', 'Grafana', 'Vector'],
    group: 'observability',
  },
  {
    slug: 'tracing-stack',
    name: 'Tracing Stack',
    components: ['Tempo', 'Grafana', 'OpenTelemetry Collector'],
    group: 'observability',
  },
  {
    slug: 'identity-stack',
    name: 'Identity Stack',
    components: ['Keycloak', 'PostgreSQL', 'oauth2-proxy'],
    group: 'security',
  },
  {
    slug: 'postgres-ha-stack',
    name: 'Postgres HA Stack',
    components: ['PostgreSQL', 'Patroni', 'PgBouncer', 'postgres_exporter', 'Prometheus', 'Grafana'],
    group: 'data',
  },
  {
    slug: 'cache-stack',
    name: 'Cache Stack',
    components: ['Valkey', 'redis_exporter', 'Prometheus', 'Grafana'],
    group: 'data',
  },
  {
    slug: 'streaming-stack',
    name: 'Streaming Stack',
    components: ['Kafka', 'Karapace', 'AKHQ'],
    group: 'data',
  },
  {
    slug: 'secrets-stack',
    name: 'Secrets Stack',
    components: ['OpenBao', 'Keycloak'],
    group: 'security',
  },
  {
    slug: 'ml-stack',
    name: 'ML Stack',
    components: ['JupyterHub', 'MLflow', 'Label Studio', 'PostgreSQL'],
    group: 'ai',
  },
  {
    slug: 'sigstore-stack',
    name: 'Sigstore Stack',
    components: ['Fulcio', 'Rekor v2', 'Timestamp Authority', 'Caddy'],
    group: 'security',
  },
  {
    slug: 'gitops-stack',
    name: 'GitOps Stack',
    components: ['Argo CD', 'Argo Rollouts', 'Argo Workflows', 'Argo Events', 'NATS'],
    group: 'platform',
    operator: true,
  },
  {
    slug: 'llm-stack',
    name: 'LLM Stack',
    components: ['Ollama', 'LiteLLM', 'Qdrant'],
    group: 'ai',
  },
  {
    slug: 'lakehouse-stack',
    name: 'Lakehouse Stack',
    components: ['Trino', 'Nessie', 'SeaweedFS', 'Apache Iceberg'],
    group: 'data',
  },
  {
    slug: 'backup-stack',
    name: 'Backup Stack',
    components: ['Velero', 'Velero AWS plugin', 'SeaweedFS'],
    group: 'data',
    operator: true,
  },
  {
    slug: 'ingress-stack',
    name: 'Ingress Stack',
    components: ['ingress-nginx', 'cert-manager', 'Cluster CA issuer'],
    group: 'platform',
    operator: true,
  },
  {
    slug: 'dns-stack',
    name: 'DNS Stack',
    components: ['PowerDNS Authoritative', 'external-dns', 'Zone setup Job'],
    group: 'platform',
  },
  {
    slug: 'supply-chain-stack',
    name: 'Supply Chain Stack',
    components: ['Kyverno', 'trivy-operator', 'Signed-image policy'],
    group: 'security',
    operator: true,
  },
];
