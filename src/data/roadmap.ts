// The QuenchWorks roadmap: apps on deck, NOT yet built. Kept separate from
// catalog.yaml (which is the image factory's source of truth for *shipped* images)
// so the "what's next" list can be rich without polluting the build catalog.
//
// licenseClean: clean (OSI permissive/copyleft) | agpl (AGPL/GPL-3) | caution
// (source-available, NOT OSI — carried only with a loud note + a clean alternative).
// priority: next (strongest candidates) | planned | exploring.

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

export const roadmap: RoadmapItem[] = [
  // ── Secrets & identity ───────────────────────────────────────────────
  { name: 'Authelia', category: 'Secrets & identity', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Authentication and 2FA gateway for reverse proxies.' },
  { name: 'Dex', category: 'Secrets & identity', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'OIDC identity hub that federates upstream providers.' },
  { name: 'Vault', category: 'Secrets & identity', license: 'BUSL-1.1', licenseClean: 'caution', priority: 'exploring', note: 'HashiCorp Vault. Source-available, not OSI.', cleanAlternative: 'OpenBao (MPL-2.0) — the open fork.' },

  // ── Gateways & proxies ───────────────────────────────────────────────
  { name: 'HAProxy', category: 'Gateways & proxies', license: 'GPL-2.0', licenseClean: 'clean', priority: 'planned', note: 'High-performance TCP/HTTP load balancer.' },
  { name: 'Envoy', category: 'Gateways & proxies', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'L7 proxy and the data plane behind most service meshes.' },
  { name: 'Caddy', category: 'Gateways & proxies', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Web server with automatic HTTPS.' },
  { name: 'Kong Gateway', category: 'Gateways & proxies', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'API gateway built on nginx/OpenResty.' },
  { name: 'Apache APISIX', category: 'Gateways & proxies', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Dynamic, high-performance API gateway.' },

  // ── Observability ────────────────────────────────────────────────────
  { name: 'Tempo', category: 'Observability', license: 'AGPL-3.0', licenseClean: 'agpl', priority: 'planned', note: 'Distributed tracing backend for the Grafana stack.' },
  { name: 'Mimir', category: 'Observability', license: 'AGPL-3.0', licenseClean: 'agpl', priority: 'exploring', note: 'Horizontally scalable long-term metrics storage.' },
  { name: 'Thanos', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Long-term storage and global query for Prometheus.' },
  { name: 'Vector', category: 'Observability', license: 'MPL-2.0', licenseClean: 'clean', priority: 'planned', note: 'High-performance logs/metrics pipeline (Rust).' },
  { name: 'Fluent Bit', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Lightweight log and metrics shipper.' },
  { name: 'Jaeger', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'End-to-end distributed tracing.' },
  { name: 'VictoriaLogs', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Fast, cost-effective log database from the VictoriaMetrics team.' },
  { name: 'node-exporter', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', deliverable: 'image', note: 'Host metrics exporter for Prometheus.' },
  { name: 'blackbox-exporter', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', deliverable: 'image', note: 'Probe endpoints over HTTP, TCP, ICMP, DNS.' },
  { name: 'Graylog', category: 'Observability', license: 'SSPL-1.0', licenseClean: 'caution', priority: 'planned', note: 'Centralized log management and analysis. Source-available, not OSI.', cleanAlternative: 'Loki (AGPL) + OpenSearch (Apache-2.0) for a truly-open logging stack.' },
  { name: 'Apache SkyWalking', category: 'Observability', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'APM: distributed tracing, metrics, and service-topology analysis.' },

  // ── Search & vector ──────────────────────────────────────────────────
  { name: 'Weaviate', category: 'Search & vector', license: 'BSD-3-Clause', licenseClean: 'clean', priority: 'planned', note: 'Vector database with hybrid search.' },
  { name: 'Milvus', category: 'Search & vector', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Scalable vector database for AI workloads.' },
  { name: 'Meilisearch', category: 'Search & vector', license: 'MIT', licenseClean: 'clean', priority: 'planned', note: 'Fast, typo-tolerant full-text search.' },
  { name: 'Typesense', category: 'Search & vector', license: 'GPL-3.0', licenseClean: 'agpl', priority: 'exploring', note: 'Typo-tolerant search engine, an Algolia alternative.' },
  { name: 'Quickwit', category: 'Search & vector', license: 'AGPL-3.0', licenseClean: 'agpl', priority: 'exploring', note: 'Search engine for logs and traces on object storage.' },

  // ── Workflow & data ──────────────────────────────────────────────────
  { name: 'Apache Airflow', category: 'Workflow & data', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Programmatic workflow scheduling and orchestration.' },
  { name: 'Apache Flink', category: 'Workflow & data', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Stateful stream processing.' },
  { name: 'Apache Spark', category: 'Workflow & data', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Unified batch and stream analytics engine.' },
  { name: 'Dagster', category: 'Workflow & data', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Data orchestrator for ML and analytics pipelines.' },
  { name: 'xyops', category: 'Workflow & data', license: 'BSD-3-Clause', licenseClean: 'clean', priority: 'planned', note: 'Workflow automation and server monitoring system.' },
  { name: 'n8n', category: 'Workflow & data', license: 'Sustainable Use License', licenseClean: 'caution', priority: 'planned', note: 'Fair-code workflow automation with native AI. Source-available, not OSI.', cleanAlternative: 'No drop-in clean equivalent; Temporal (MIT) for code-first orchestration.' },

  // ── Messaging & streaming ────────────────────────────────────────────
  { name: 'EMQX', category: 'Messaging & streaming', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Scalable MQTT broker for IoT.' },
  { name: 'Mosquitto', category: 'Messaging & streaming', license: 'EPL-2.0', licenseClean: 'clean', priority: 'planned', note: 'Lightweight MQTT broker.' },
  { name: 'NSQ', category: 'Messaging & streaming', license: 'MIT', licenseClean: 'clean', priority: 'exploring', note: 'Realtime distributed messaging.' },
  { name: 'Centrifugo', category: 'Messaging & streaming', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Realtime messaging / WebSocket server.' },
  { name: 'Redpanda', category: 'Messaging & streaming', license: 'BSL-1.1', licenseClean: 'caution', priority: 'exploring', note: 'Kafka-compatible streaming. Source-available, not OSI.', cleanAlternative: 'Kafka or Pulsar (Apache-2.0), both already shipped.' },

  // ── Coordination & mesh ──────────────────────────────────────────────
  { name: 'CoreDNS', category: 'Coordination & mesh', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Flexible, pluggable DNS server.' },
  { name: 'Istio', category: 'Coordination & mesh', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Service mesh built on Envoy: traffic management, mTLS, and observability. Platform-scale, a multi-image wave (istiod control plane plus Envoy sidecars and gateways) rather than a single image.' },
  { name: 'Linkerd', category: 'Coordination & mesh', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Lightweight service mesh.' },
  { name: 'Consul', category: 'Coordination & mesh', license: 'BUSL-1.1', licenseClean: 'caution', priority: 'exploring', note: 'Service discovery and mesh. Source-available, not OSI.', cleanAlternative: 'etcd (Apache-2.0) for KV/coordination, already shipped.' },
  { name: 'Nomad', category: 'Coordination & mesh', license: 'BUSL-1.1', licenseClean: 'caution', priority: 'exploring', note: 'Workload scheduler. Source-available, not OSI.' },

  // ── Databases & engines ──────────────────────────────────────────────
  { name: 'TimescaleDB', category: 'Databases & engines', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'PostgreSQL extension for time-series (Apache-2.0 core).' },
  { name: 'QuestDB', category: 'Databases & engines', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'High-performance time-series database with SQL.' },
  { name: 'DuckDB', category: 'Databases & engines', license: 'MIT', licenseClean: 'clean', priority: 'exploring', deliverable: 'image', note: 'In-process analytical database (OLAP); ships as a CLI/base image.' },
  { name: 'TigerBeetle', category: 'Databases & engines', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Financial accounting database, high-throughput.' },
  { name: 'Vitess', category: 'Databases & engines', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Horizontal sharding for MySQL.' },
  { name: 'ProxySQL', category: 'Databases & engines', license: 'GPL-3.0', licenseClean: 'agpl', priority: 'exploring', note: 'High-performance proxy for MySQL/MariaDB.' },
  { name: 'SurrealDB', category: 'Databases & engines', license: 'BUSL-1.1', licenseClean: 'caution', priority: 'exploring', note: 'Multi-model database. Source-available, not OSI.' },

  // ── Storage & platform ───────────────────────────────────────────────
  { name: 'Apache Ozone', category: 'Storage & platform', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Scalable distributed object store (S3 + HDFS).' },
  { name: 'Gitea', category: 'Storage & platform', license: 'MIT', licenseClean: 'clean', priority: 'planned', note: 'Lightweight self-hosted Git service.' },
  { name: 'Forgejo', category: 'Storage & platform', license: 'GPL-3.0', licenseClean: 'agpl', priority: 'exploring', note: 'Community Git forge, a Gitea fork.' },
  { name: 'Woodpecker CI', category: 'Storage & platform', license: 'Apache-2.0', licenseClean: 'clean', priority: 'exploring', note: 'Simple container-native CI engine.' },
  { name: 'Atlantis', category: 'Storage & platform', license: 'Apache-2.0', licenseClean: 'clean', priority: 'next', deliverable: 'image+chart', note: 'Terraform/OpenTofu pull-request automation: runs plan/apply on PRs via webhooks.' },
  { name: 'SonarQube', category: 'Storage & platform', license: 'LGPL-3.0', licenseClean: 'clean', priority: 'exploring', note: 'Continuous code-quality and security inspection.' },
  { name: 'Coolify', category: 'Storage & platform', license: 'Apache-2.0', licenseClean: 'clean', priority: 'planned', note: 'Self-hostable PaaS (Heroku/Netlify alternative). Built as a multi-image component wave (hardened app + realtime images, reusing our PostgreSQL/Redis/Traefik) packaged as a Harbor-style umbrella chart. The orchestration tier (proxy/helper) stays privileged by design.' },
  { name: 'Dokploy', category: 'Storage & platform', license: 'Apache-2.0 + DSAL-1.0', licenseClean: 'caution', priority: 'exploring', note: 'Self-hostable PaaS on Docker Swarm. Open-core: most is Apache-2.0, the /proprietary parts are source-available (DSAL-1.0). Not a fit for the hardened catalog: it requires root, the Docker socket, and an initialized Swarm, so it cannot run nonroot or read-only.', cleanAlternative: 'Coolify (Apache-2.0).' },
];

export const roadmapTotal = roadmap.length;
export const roadmapCategories = [...new Set(roadmap.map((r) => r.category))];

const PRIORITY_ORDER: Record<Priority, number> = { next: 0, planned: 1, exploring: 2 };
export const byPriority = (a: RoadmapItem, b: RoadmapItem) =>
  PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.name.localeCompare(b.name);
