// check-suggest.mjs — the one runnable check behind the catalog search
// suggestions. Asserts the ranking contract in src/data/suggest.ts (name before
// category before summary; ties toward the catalog you're on; the `name === slug`
// shorthand) and, if `dist/` has been built, that the emitted index still
// matches that shape.
//
//   node scripts/check-suggest.mjs
//
// Node strips the TypeScript types on import, so there's no build step and no
// test framework to install.

import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  rankSuggestions,
  suggestName,
  suggestScore,
  SUGGEST_MAX,
} from '../src/data/suggest.ts';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

// [kind, slug, name (0 when === slug), categoryLabel, summary snippet]
const IMG = 0;
const CHART = 1;
const rows = [
  [IMG, 'redis', 'Redis', 'Cache', 'In-memory key-value store used as a cache and message broker.'],
  [CHART, 'redis', 'Redis', 'Cache', 'Hardened Redis chart on a 0-CVE image.'],
  [IMG, 'redis-exporter', 0, 'Metrics/Exporter', 'Prometheus exporter for Redis.'],
  [IMG, 'valkey', 0, 'Cache', 'Fork of Redis 7.2, BSD licensed.'],
  [IMG, 'postgresql', 0, 'Relational', 'The relational database.'],
  [CHART, 'airflow', 0, 'Workflow', 'Programmatic workflow orchestration for DAGs.'],
];

// --- suggestName: rows omit `name` when it is identical to `slug` ------------
assert.equal(suggestName(rows[0]), 'Redis');
assert.equal(suggestName(rows[3]), 'valkey');

// --- suggestScore: name first, then category, then summary; -1 = no match ---
assert.equal(suggestScore(rows[0], 'redis'), 0, 'exact name');
assert.equal(suggestScore(rows[2], 'redis'), 1, 'name prefix');
assert.equal(suggestScore(rows[2], 'exporter'), 2, 'name substring');
assert.equal(suggestScore(rows[3], 'cache'), 3, 'category');
assert.equal(suggestScore(rows[3], 'bsd'), 4, 'summary');
assert.equal(suggestScore(rows[4], 'zzz'), -1, 'no match');

// --- rankSuggestions --------------------------------------------------------
// Name matches outrank the summary match on valkey ("Fork of Redis 7.2").
const onImages = rankSuggestions(rows, 'redis', IMG);
assert.deepEqual(
  onImages.map((r) => [r[0], r[1]]),
  [
    [IMG, 'redis'], // exact name, and images win the tie on /images
    [CHART, 'redis'], // exact name
    [IMG, 'redis-exporter'], // name prefix
    [IMG, 'valkey'], // summary only
  ],
);

// Same query on /charts: identical ranks, but the tie flips to the chart.
const onCharts = rankSuggestions(rows, 'redis', CHART);
assert.deepEqual(
  onCharts.slice(0, 2).map((r) => [r[0], r[1]]),
  [
    [CHART, 'redis'],
    [IMG, 'redis'],
  ],
);

// All three "cache" hits rank equally (category match), so the tiebreaks decide:
// this catalog's kind first, then shorter name, then alphabetically — stable
// across keystrokes.
assert.deepEqual(
  rankSuggestions(rows, 'cache', IMG).map((r) => [r[0], r[1]]),
  [
    [IMG, 'redis'],
    [IMG, 'valkey'],
    [CHART, 'redis'],
  ],
);

// Shorter-name-first: both are prefix matches, so the one closest to what was
// typed wins. Without this tiebreak `localeCompare` puts the hyphen first and
// "postgres" leads with the exporter.
const pg = [
  [IMG, 'postgresql', 'PostgreSQL', 'Relational', 'The relational database.'],
  [IMG, 'postgres-exporter', 0, 'Metrics/Exporter', 'Prometheus exporter for PostgreSQL.'],
];
assert.deepEqual(
  rankSuggestions(pg, 'postgres', IMG).map((r) => r[1]),
  ['postgresql', 'postgres-exporter'],
);

// Non-matches never leak in, and the cap holds.
assert.deepEqual(rankSuggestions(rows, 'nothinghere', IMG), []);
assert.ok(rankSuggestions(rows, 'e', IMG).length <= SUGGEST_MAX);

// --- the built index, when there is one -------------------------------------
const built = resolve(root, 'dist/suggest/en.json');
if (existsSync(built)) {
  const index = JSON.parse(readFileSync(built, 'utf8'));
  assert.ok(Array.isArray(index) && index.length > 100, 'index looks populated');
  for (const r of index) {
    assert.equal(r.length, 5, `row must be a 5-tuple: ${JSON.stringify(r)}`);
    assert.ok(r[0] === 0 || r[0] === 1, `kind must be 0|1: ${JSON.stringify(r)}`);
    assert.equal(typeof r[1], 'string');
    assert.ok(r[2] === 0 || typeof r[2] === 'string');
    assert.ok(r[2] !== r[1], `name should be 0 when identical to slug: ${JSON.stringify(r)}`);
  }
  assert.ok(index.some((r) => r[0] === 0), 'index has images');
  assert.ok(index.some((r) => r[0] === 1), 'index has charts');
  console.log(`ok — ranking contract + ${index.length} built rows`);
} else {
  console.log('ok — ranking contract (dist/ not built, skipped the emitted index)');
}
