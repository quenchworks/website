// sync-catalog.mjs — regenerate src/data/{charts,images}.json from the source-of-truth
// sibling repos (../images/catalog.yaml + ../charts/quench/<app>/*). Idempotent and
// tolerant: a missing sibling file just means that field is skipped, never a crash.
//
// Run: `node scripts/sync-catalog.mjs` (also wired into `prebuild`).

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const websiteRoot = resolve(here, '..');
const repoRoot = resolve(websiteRoot, '..'); // __QuenchWorks__
const catalogYaml = resolve(repoRoot, 'images', 'catalog.yaml');
const chartsDir = resolve(repoRoot, 'charts', 'quench');
const outDir = resolve(websiteRoot, 'src', 'data');

// ──────────────────────────────────────────────────────────────────────────
// Editorial map: category + marketing one-liner per slug. NOT in catalog.yaml.
// Seeded from the old catalog.json where present; written fresh for the rest.
// Keyed by app name as it appears in catalog.yaml / charts dir.
// ──────────────────────────────────────────────────────────────────────────
const EDITORIAL = {
  valkey: { category: 'Cache', summary: 'BSD-licensed in-memory key-value store. QuenchWorks leads with Valkey as the open cache.' },
  redis: { category: 'Cache', summary: 'In-memory key-value store and cache. Shipped under AGPL; Valkey is the BSD alternative.' },
  dragonfly: { category: 'Cache', summary: 'Multi-threaded Redis/Memcached-compatible datastore. Source-available (BSL) — prefer Valkey.' },
  memcached: { category: 'Cache', summary: 'High-performance distributed memory object cache.' },
  postgresql: { category: 'Relational', summary: 'Advanced open-source relational database with strong SQL and extensibility.' },
  mariadb: { category: 'Relational', summary: 'Community-developed relational database, a drop-in MySQL successor.' },
  mysql: { category: 'Relational', summary: 'Widely used open-source relational database.' },
  cockroachdb: { category: 'Relational', summary: 'Distributed Postgres-wire SQL. Source-available (BSL) — no clean in-catalog substitute yet.' },
  etcd: { category: 'Coordination', summary: 'Distributed, strongly consistent key-value store for coordination and config.' },
  zookeeper: { category: 'Coordination', summary: 'Centralized service for configuration, naming, and synchronization.' },
  ferretdb: { category: 'Document', summary: 'MongoDB-compatible document database built on PostgreSQL. The clean-license substitute for MongoDB.' },
  documentdb: { category: 'Document', summary: 'Self-contained MongoDB-compatible server (PostgreSQL + DocumentDB extension + wire gateway). Truly open.' },
  'postgres-documentdb': { category: 'Document', summary: 'PostgreSQL 17 + DocumentDB extension — the FerretDB v2 storage backend.' },
  couchdb: { category: 'Document', summary: 'Document database with an HTTP API and multi-master replication.' },
  mongodb: { category: 'Document', summary: 'Document database. SSPL is not OSI; prefer FerretDB or DocumentDB.' },
  cassandra: { category: 'Wide-column', summary: 'Distributed wide-column store built for linear scale and availability.' },
  scylladb: { category: 'Wide-column', summary: 'High-throughput wide-column store, Cassandra-compatible.' },
  clickhouse: { category: 'Analytical', summary: 'Column-oriented database for real-time analytics over large datasets.' },
  opensearch: { category: 'Search', summary: 'Search and analytics suite. The Apache-licensed alternative to Elasticsearch.' },
  solr: { category: 'Search', summary: 'Search platform built on Apache Lucene.' },
  elasticsearch: { category: 'Search', summary: 'Search and analytics engine. SSPL/Elastic license; OpenSearch is the OSI alternative.' },
  influxdb: { category: 'Time series', summary: 'Time-series database for metrics and events.' },
  victoriametrics: { category: 'Time series', summary: 'Fast, cost-effective time-series database and monitoring backend.' },
  neo4j: { category: 'Graph', summary: 'Graph database for connected data. Community edition is GPLv3.' },
  kafka: { category: 'Messaging', summary: 'Distributed event-streaming platform.' },
  rabbitmq: { category: 'Messaging', summary: 'Reliable message broker supporting AMQP and more.' },
  nats: { category: 'Messaging', summary: 'Lightweight, high-performance messaging system.' },
  pulsar: { category: 'Messaging', summary: 'Cloud-native distributed messaging and streaming.' },
  nginx: { category: 'Gateway', summary: 'High-performance web server and reverse proxy.' },
  seaweedfs: { category: 'Object storage', summary: "S3-compatible distributed object store. QuenchWorks' default object-storage pick after MinIO gutted its community edition." },
  garage: { category: 'Object storage', summary: 'Lightweight S3-compatible object store (AGPL). A self-hosting-friendly alternative to SeaweedFS.' },
  rustfs: { category: 'Object storage', summary: 'S3-compatible object store written in Rust, a MinIO-style alternative. Beta/preview.' },
  prometheus: { category: 'Observability', summary: 'Metrics collection, storage, and alerting. The de-facto monitoring TSDB.' },
  grafana: { category: 'Observability', summary: 'Dashboards and visualization for metrics and logs. OSS edition (AGPL).' },
  busybox: { category: 'Base image', summary: 'Hardened minimal base/toolbox image. Image only, no chart.' },
  'redis-exporter': { category: 'Metrics/Exporter', summary: 'Prometheus metrics exporter for Redis/Valkey.' },
  'postgres-exporter': { category: 'Metrics/Exporter', summary: 'Prometheus metrics exporter for PostgreSQL.' },
  // Language runtimes — hardened, 0-CVE, signed base images you FROM (like Chainguard's), latest 3 stable each.
  python: { category: 'Language runtime', summary: 'Hardened CPython interpreter + pip. A 0-CVE, signed, nonroot base image for Python apps. Latest 3 stable minors (no :latest).' },
  node: { category: 'Language runtime', summary: 'Hardened Node.js runtime + npm. Active LTS lines (20/22/24).' },
  dotnet: { category: 'Language runtime', summary: 'Hardened .NET SDK (build and run). Latest 3 stable, including LTS (8/9/10).' },
  jdk: { category: 'Language runtime', summary: 'Hardened OpenJDK with javac. LTS lines 17/21/25.' },
  ruby: { category: 'Language runtime', summary: 'Hardened Ruby interpreter + bundler. Latest 3 stable (3.2/3.3/3.4).' },
  php: { category: 'Language runtime', summary: 'Hardened PHP cli + common extensions. Latest 3 stable (8.3/8.4/8.5).' },
  go: { category: 'Language runtime', summary: 'Hardened Go toolchain for builds; pair with a minimal base for the runtime. Latest 3 stable (1.24/1.25/1.26).' },
  rust: { category: 'Language runtime', summary: 'Hardened Rust toolchain (cargo + rustc). Latest 3 stable (1.94/1.95/1.96).' },
};

// Upstream repo per slug (catalog.yaml `source` may be a tarball URL, not a repo).
const UPSTREAM = {
  valkey: 'https://github.com/valkey-io/valkey',
  redis: 'https://github.com/redis/redis',
  dragonfly: 'https://github.com/dragonflydb/dragonfly',
  memcached: 'https://github.com/memcached/memcached',
  postgresql: 'https://github.com/postgres/postgres',
  mariadb: 'https://github.com/MariaDB/server',
  mysql: 'https://github.com/mysql/mysql-server',
  cockroachdb: 'https://github.com/cockroachdb/cockroach',
  etcd: 'https://github.com/etcd-io/etcd',
  zookeeper: 'https://github.com/apache/zookeeper',
  ferretdb: 'https://github.com/FerretDB/FerretDB',
  documentdb: 'https://github.com/documentdb/documentdb',
  'postgres-documentdb': 'https://github.com/FerretDB/documentdb',
  couchdb: 'https://github.com/apache/couchdb',
  mongodb: 'https://github.com/mongodb/mongo',
  cassandra: 'https://github.com/apache/cassandra',
  scylladb: 'https://github.com/scylladb/scylladb',
  clickhouse: 'https://github.com/ClickHouse/ClickHouse',
  opensearch: 'https://github.com/opensearch-project/OpenSearch',
  solr: 'https://github.com/apache/solr',
  elasticsearch: 'https://github.com/elastic/elasticsearch',
  influxdb: 'https://github.com/influxdata/influxdb',
  victoriametrics: 'https://github.com/VictoriaMetrics/VictoriaMetrics',
  neo4j: 'https://github.com/neo4j/neo4j',
  kafka: 'https://github.com/apache/kafka',
  rabbitmq: 'https://github.com/rabbitmq/rabbitmq-server',
  nats: 'https://github.com/nats-io/nats-server',
  pulsar: 'https://github.com/apache/pulsar',
  nginx: 'https://github.com/nginx/nginx',
  seaweedfs: 'https://github.com/seaweedfs/seaweedfs',
  garage: 'https://github.com/deuxfleurs-org/garage',
  rustfs: 'https://github.com/rustfs/rustfs',
  prometheus: 'https://github.com/prometheus/prometheus',
  grafana: 'https://github.com/grafana/grafana',
  busybox: 'https://busybox.net',
};

// Caution apps: license is NOT OSI-approved -> loud banner + clean alternative.
const CAUTION = {
  cockroachdb: { cleanAlternative: 'No in-catalog clean substitute yet — evaluate PostgreSQL for single-region SQL.' },
  dragonfly: { cleanAlternative: 'Valkey (BSD-3-Clause) — the truly-open Redis-compatible cache.' },
  mongodb: { cleanAlternative: 'FerretDB + DocumentDB — MongoDB-wire-compatible and truly open (Apache-2.0 / PostgreSQL).' },
  elasticsearch: { cleanAlternative: 'OpenSearch (Apache-2.0) — the open drop-in fork of Elasticsearch.' },
};

// These are infrastructure/sidecar pieces, not user-facing datastore products.
// We exclude them from both indexes (they have no standalone chart anyway).
const EXCLUDE = new Set(['redis-exporter', 'postgres-exporter', 'quench-common']);

// status -> published? built/done/pilot all mean "an image exists".
const PUBLISHED = new Set(['built', 'done', 'pilot']);

// ──────────────────────────────────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────────────────────────────────
function readYamlSafe(path) {
  try {
    if (!existsSync(path)) return null;
    return parseYaml(readFileSync(path, 'utf8'));
  } catch (err) {
    console.warn(`! could not parse ${path}: ${err.message}`);
    return null;
  }
}

// Normalize SPDX-ish license strings (catalog.yaml uses `-only` suffixes etc.).
function normalizeLicense(raw) {
  if (!raw) return 'Unknown';
  return String(raw).replace(/-only$/, '').replace(/-or-later$/, '+').trim();
}

// clean | agpl | caution
function deriveLicenseClean(license) {
  const l = (license || '').toUpperCase();
  if (l.includes('BSL') || l.includes('BUSL') || l.includes('SSPL')) return 'caution';
  if (l.includes('AGPL') || l.startsWith('GPL-3')) return 'agpl';
  return 'clean'; // Apache/BSD/MIT/PostgreSQL/MPL/GPL-2.0 etc.
}

function editorial(slug) {
  return EDITORIAL[slug] || { category: 'Datastore', summary: `Hardened ${slug} image, built from source on Wolfi.` };
}

// Pull the first service port from a chart values doc (best-effort).
function servicePort(values) {
  if (!values || typeof values !== 'object') return undefined;
  const svc = values.service;
  if (svc && typeof svc === 'object' && (typeof svc.port === 'number' || typeof svc.port === 'string')) {
    return svc.port;
  }
  return undefined;
}

// ──────────────────────────────────────────────────────────────────────────
// 1) read catalog.yaml -> images.json source rows
// ──────────────────────────────────────────────────────────────────────────
const catalogDoc = readYamlSafe(catalogYaml);
const rows = (catalogDoc && Array.isArray(catalogDoc.catalog)) ? catalogDoc.catalog : [];

// Source-of-truth repos are siblings of the website repo. In a CI/host build (e.g.
// Cloudflare Pages) only the website repo is checked out, so catalog.yaml is absent.
// In that case the committed src/data/{charts,images}.json IS the source for the build:
// keep it, and never overwrite it with empty arrays. Only regenerate when the sibling
// catalog is actually present (local dev / a checkout that includes the repos).
if (!rows.length) {
  const have =
    existsSync(resolve(outDir, 'charts.json')) && existsSync(resolve(outDir, 'images.json'));
  if (have) {
    console.warn(
      `! ${catalogYaml} not found — keeping the committed src/data/{charts,images}.json (this is expected in a website-only/CI build).`,
    );
    process.exit(0);
  }
  console.error(
    `✗ ${catalogYaml} not found and no committed src/data/*.json to fall back on. ` +
      `Run this with the images/ and charts/ repos checked out as siblings.`,
  );
  process.exit(1);
}

const ghcr = 'ghcr.io/quenchworks';

const images = [];
for (const row of rows) {
  const slug = row?.name;
  if (!slug || EXCLUDE.has(slug)) continue;

  const license = normalizeLicense(row.license);
  const licenseClean = deriveLicenseClean(license);
  const ed = editorial(slug);
  const published = PUBLISHED.has(String(row.status));

  const entry = {
    slug,
    name: prettyName(slug),
    category: ed.category,
    summary: ed.summary,
    tier: String(row.tier || 'standard'),
    status: published ? 'available' : 'planned',
    license,
    licenseClean,
    version: row.version != null ? String(row.version) : undefined,
    upstream: UPSTREAM[slug] || String(row.source || ''),
    source: String(row.source || ''),
    image: `${ghcr}/images/${slug}`,
  };

  if (CAUTION[slug]) {
    entry.caution = true;
    entry.cleanAlternative = CAUTION[slug].cleanAlternative;
  }

  images.push(entry);
}

// ──────────────────────────────────────────────────────────────────────────
// 2) read charts/quench/<app> -> charts.json
// ──────────────────────────────────────────────────────────────────────────
const charts = [];
let chartDirs = [];
try {
  chartDirs = readdirSync(chartsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => !EXCLUDE.has(n) && n !== 'quench-common');
} catch (err) {
  console.warn(`! could not read charts dir ${chartsDir}: ${err.message}`);
}

for (const slug of chartDirs.sort()) {
  const dir = resolve(chartsDir, slug);
  const chartYaml = readYamlSafe(resolve(dir, 'Chart.yaml'));
  const valuesYaml = readYamlSafe(resolve(dir, 'values.yaml'));
  const ahRepo = readYamlSafe(resolve(dir, 'artifacthub-repo.yml'));

  // license/tier come from the catalog.yaml row when available
  const catRow = rows.find((r) => r?.name === slug);
  const licenseFinal = catRow?.license ? normalizeLicense(catRow.license) : 'Unknown';
  const licenseClean = deriveLicenseClean(licenseFinal);
  const ed = editorial(slug);

  const img = valuesYaml?.image || {};
  const entry = {
    slug,
    name: prettyName(chartYaml?.name || slug),
    category: ed.category,
    summary: ed.summary,
    tier: String(catRow?.tier || 'standard'),
    license: licenseFinal,
    licenseClean,
    chartVersion: chartYaml?.version != null ? String(chartYaml.version) : undefined,
    appVersion: chartYaml?.appVersion != null ? String(chartYaml.appVersion) : (catRow?.version != null ? String(catRow.version) : undefined),
    description: chartYaml?.description ? String(chartYaml.description) : undefined,
    imageRepository: img.repository ? String(img.repository) : `${ghcr}/images/${slug}`,
    imageDigest: img.digest ? String(img.digest) : undefined,
    repositoryID: ahRepo?.repositoryID ? String(ahRepo.repositoryID) : undefined,
    port: servicePort(valuesYaml),
    upstream: UPSTREAM[slug] || String(catRow?.source || ''),
    chartRef: `oci://${ghcr}/charts/${slug}`,
  };

  if (CAUTION[slug]) {
    entry.caution = true;
    entry.cleanAlternative = CAUTION[slug].cleanAlternative;
  }

  charts.push(entry);
}

// Pretty-print app names (catalog slugs are lowercase).
function prettyName(slug) {
  const map = {
    postgresql: 'PostgreSQL',
    'postgres-documentdb': 'PostgreSQL + DocumentDB',
    mariadb: 'MariaDB',
    mysql: 'MySQL',
    cockroachdb: 'CockroachDB',
    couchdb: 'CouchDB',
    documentdb: 'DocumentDB',
    ferretdb: 'FerretDB',
    mongodb: 'MongoDB',
    scylladb: 'ScyllaDB',
    clickhouse: 'ClickHouse',
    opensearch: 'OpenSearch',
    elasticsearch: 'Elasticsearch',
    influxdb: 'InfluxDB',
    victoriametrics: 'VictoriaMetrics',
    neo4j: 'Neo4j',
    rabbitmq: 'RabbitMQ',
    nats: 'NATS',
    zookeeper: 'ZooKeeper',
    etcd: 'etcd',
    valkey: 'Valkey',
    redis: 'Redis',
    dragonfly: 'Dragonfly',
    memcached: 'Memcached',
    kafka: 'Kafka',
    pulsar: 'Pulsar',
    cassandra: 'Cassandra',
    solr: 'Solr',
    nginx: 'nginx',
  };
  return map[slug] || slug;
}

// ──────────────────────────────────────────────────────────────────────────
// 3) write outputs (sorted: available first, then alpha)
// ──────────────────────────────────────────────────────────────────────────
const byStatusThenName = (a, b) => {
  const sa = a.status === 'available' ? 0 : 1;
  const sb = b.status === 'available' ? 0 : 1;
  if (sa !== sb) return sa - sb;
  return a.name.localeCompare(b.name);
};
images.sort(byStatusThenName);
charts.sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(resolve(outDir, 'images.json'), JSON.stringify(images, null, 2) + '\n');
writeFileSync(resolve(outDir, 'charts.json'), JSON.stringify(charts, null, 2) + '\n');

const cautionCount = images.filter((i) => i.caution).length;
console.log(
  `sync-catalog: wrote ${images.length} images (${images.filter((i) => i.status === 'available').length} available) ` +
    `and ${charts.length} charts; ${cautionCount} caution apps.`,
);
