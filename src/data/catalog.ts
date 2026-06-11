// The QuenchWorks catalog, mirrored from _plan-artifacts/catalog-databases.yaml.
// `available` entries are shipped end to end (signed image + chart); the rest are queued.
// Keep this in sync when an app ships.

export type Tier = 'critical' | 'standard' | 'low';
export type Status = 'available' | 'planned';
export type LicenseClean = 'clean' | 'agpl' | 'caution';

export interface CatalogEntry {
  slug: string;
  name: string;
  category: string;
  tier: Tier;
  status: Status;
  license: string;
  licenseClean: LicenseClean;
  version?: string; // appVersion, for shipped apps
  summary: string;
  upstream: string;
  note?: string;
}

export const catalog: CatalogEntry[] = [
  // ── Cache ────────────────────────────────────────────────────────────────
  { slug: 'valkey', name: 'Valkey', category: 'Cache', tier: 'critical', status: 'available', license: 'BSD-3-Clause', licenseClean: 'clean', version: '8.1.8', upstream: 'https://github.com/valkey-io/valkey', summary: 'BSD-licensed in-memory key-value store. QuenchWorks leads with Valkey as the open cache.' },
  { slug: 'redis', name: 'Redis', category: 'Cache', tier: 'critical', status: 'available', license: 'AGPL-3.0', licenseClean: 'agpl', version: '8.2.1', upstream: 'https://github.com/redis/redis', summary: 'In-memory key-value store and cache. Shipped under AGPL; Valkey is the BSD alternative.' },
  { slug: 'memcached', name: 'Memcached', category: 'Cache', tier: 'standard', status: 'planned', license: 'BSD-3-Clause', licenseClean: 'clean', upstream: 'https://github.com/memcached/memcached', summary: 'High-performance distributed memory object cache.' },

  // ── Relational ─────────────────────────────────────────────────────────────
  { slug: 'postgresql', name: 'PostgreSQL', category: 'Relational', tier: 'critical', status: 'available', license: 'PostgreSQL', licenseClean: 'clean', version: '17.6', upstream: 'https://github.com/postgres/postgres', summary: 'Advanced open-source relational database with strong SQL and extensibility.' },
  { slug: 'mariadb', name: 'MariaDB', category: 'Relational', tier: 'critical', status: 'planned', license: 'GPL-2.0', licenseClean: 'clean', version: '11.4.9', upstream: 'https://github.com/MariaDB/server', summary: 'Community-developed relational database, a drop-in MySQL successor.' },
  { slug: 'mysql', name: 'MySQL', category: 'Relational', tier: 'critical', status: 'planned', license: 'GPL-2.0', licenseClean: 'clean', upstream: 'https://github.com/mysql/mysql-server', summary: 'Widely used open-source relational database.' },

  // ── Coordination ────────────────────────────────────────────────────────────
  { slug: 'etcd', name: 'etcd', category: 'Coordination', tier: 'critical', status: 'available', license: 'Apache-2.0', licenseClean: 'clean', version: '3.6.12', upstream: 'https://github.com/etcd-io/etcd', summary: 'Distributed, strongly consistent key-value store for coordination and config.' },
  { slug: 'zookeeper', name: 'ZooKeeper', category: 'Coordination', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/apache/zookeeper', summary: 'Centralized service for configuration, naming, and synchronization.' },

  // ── Document ─────────────────────────────────────────────────────────────────
  { slug: 'ferretdb', name: 'FerretDB', category: 'Document', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/FerretDB/FerretDB', summary: 'MongoDB-compatible document database built on PostgreSQL. The clean-license substitute for MongoDB.' },
  { slug: 'couchdb', name: 'CouchDB', category: 'Document', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/apache/couchdb', summary: 'Document database with an HTTP API and multi-master replication.' },
  { slug: 'mongodb', name: 'MongoDB', category: 'Document', tier: 'standard', status: 'planned', license: 'SSPL-1.0', licenseClean: 'caution', upstream: 'https://github.com/mongodb/mongo', summary: 'Document database. SSPL is not OSI; prefer FerretDB where possible.', note: 'Source-available (SSPL). Carried only with a loud license note.' },

  // ── Wide-column ──────────────────────────────────────────────────────────────
  { slug: 'cassandra', name: 'Cassandra', category: 'Wide-column', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/apache/cassandra', summary: 'Distributed wide-column store built for linear scale and availability.' },
  { slug: 'scylladb', name: 'ScyllaDB', category: 'Wide-column', tier: 'low', status: 'planned', license: 'AGPL-3.0', licenseClean: 'agpl', upstream: 'https://github.com/scylladb/scylladb', summary: 'High-throughput wide-column store, Cassandra-compatible.' },

  // ── Analytical ────────────────────────────────────────────────────────────────
  { slug: 'clickhouse', name: 'ClickHouse', category: 'Analytical', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/ClickHouse/ClickHouse', summary: 'Column-oriented database for real-time analytics over large datasets.' },

  // ── Search ─────────────────────────────────────────────────────────────────────
  { slug: 'opensearch', name: 'OpenSearch', category: 'Search', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/opensearch-project/OpenSearch', summary: 'Search and analytics suite. The Apache-licensed alternative to Elasticsearch.' },
  { slug: 'solr', name: 'Solr', category: 'Search', tier: 'low', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/apache/solr', summary: 'Search platform built on Apache Lucene.' },
  { slug: 'elasticsearch', name: 'Elasticsearch', category: 'Search', tier: 'low', status: 'planned', license: 'SSPL-1.0', licenseClean: 'caution', upstream: 'https://github.com/elastic/elasticsearch', summary: 'Search and analytics engine. SSPL/Elastic license; OpenSearch is the OSI alternative.', note: 'Source-available. Prefer OpenSearch.' },

  // ── Time series ──────────────────────────────────────────────────────────────────
  { slug: 'influxdb', name: 'InfluxDB', category: 'Time series', tier: 'standard', status: 'planned', license: 'MIT', licenseClean: 'clean', upstream: 'https://github.com/influxdata/influxdb', summary: 'Time-series database for metrics and events.' },
  { slug: 'victoriametrics', name: 'VictoriaMetrics', category: 'Time series', tier: 'low', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/VictoriaMetrics/VictoriaMetrics', summary: 'Fast, cost-effective time-series database and monitoring backend.' },

  // ── Graph ─────────────────────────────────────────────────────────────────────────
  { slug: 'neo4j', name: 'Neo4j', category: 'Graph', tier: 'low', status: 'planned', license: 'GPL-3.0', licenseClean: 'agpl', upstream: 'https://github.com/neo4j/neo4j', summary: 'Graph database for connected data. Community edition is GPLv3.' },

  // ── Messaging ──────────────────────────────────────────────────────────────────────
  { slug: 'kafka', name: 'Kafka', category: 'Messaging', tier: 'critical', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/apache/kafka', summary: 'Distributed event-streaming platform.' },
  { slug: 'rabbitmq', name: 'RabbitMQ', category: 'Messaging', tier: 'critical', status: 'planned', license: 'MPL-2.0', licenseClean: 'clean', upstream: 'https://github.com/rabbitmq/rabbitmq-server', summary: 'Reliable message broker supporting AMQP and more.' },
  { slug: 'nats', name: 'NATS', category: 'Messaging', tier: 'standard', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/nats-io/nats-server', summary: 'Lightweight, high-performance messaging system.' },
  { slug: 'pulsar', name: 'Pulsar', category: 'Messaging', tier: 'low', status: 'planned', license: 'Apache-2.0', licenseClean: 'clean', upstream: 'https://github.com/apache/pulsar', summary: 'Cloud-native distributed messaging and streaming.' },
];

export const categories = [...new Set(catalog.map((c) => c.category))];
export const availableCount = catalog.filter((c) => c.status === 'available').length;
export const ghcr = 'ghcr.io/quenchworks';
