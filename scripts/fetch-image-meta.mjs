#!/usr/bin/env node
// Fetch build-time metadata for every AVAILABLE QuenchWorks image and write it
// to src/data/image-meta.json, keyed by image slug. Run this LOCALLY (it needs
// registry read + gh auth); the result is committed and read statically at build
// time, so the Cloudflare build never touches a registry.
//
// Per image we capture:
//   sizeBytes    sum of amd64 layer sizes (compressed download size)
//   builtISO     image build timestamp (config .created)
//   sbomPackages count of SPDX packages in the SBOM attestation (best effort)
//
// Tools used: `docker buildx imagetools inspect --raw` (manifests + config blob),
// `gh attestation verify` (SBOM). No `crane` required.
//
// Usage: node scripts/fetch-image-meta.mjs [--slug redis] [--no-sbom]

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const execFileP = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const args = process.argv.slice(2);
const onlySlug = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
const skipSbom = args.includes('--no-sbom');
const OWNER = 'quenchworks';
const SPDX = 'https://spdx.dev/Document';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Registry + sigstore calls are flaky under concurrency (GHCR throttling,
// transient TLS resets). Retry a few times with backoff before giving up.
async function run(cmd, cmdArgs, timeoutMs = 120000) {
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const { stdout } = await execFileP(cmd, cmdArgs, {
        timeout: timeoutMs,
        maxBuffer: 64 * 1024 * 1024,
      });
      return stdout;
    } catch (err) {
      lastErr = err;
      if (attempt < 4) await sleep(attempt * 1500);
    }
  }
  throw lastErr;
}

// Raw manifest/blob fetch. Works for the OCI index, a per-arch manifest, and the
// config blob (imagetools happily returns blob bytes for a config digest).
async function raw(ref) {
  const out = await run('docker', ['buildx', 'imagetools', 'inspect', '--raw', ref]);
  return JSON.parse(out);
}

// The `version` field may list several tags (e.g. "8, 9, 10", catalog order is
// ascending). Metadata is captured per tag, so split into the full list. An
// image with no version field falls back to a single untagged pull.
function tagsOf(version) {
  if (!version) return [null];
  const tags = String(version)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return tags.length ? tags : [null];
}

// Fetch metadata for one specific tag of one repo.
async function fetchTag(repo, tag) {
  const ref = tag ? `${repo}:${tag}` : repo;
  const meta = {};

  // 1. Resolve the OCI index, then the amd64 manifest within it.
  const index = await raw(ref);
  let manifest;
  let indexDigest;

  if (Array.isArray(index.manifests)) {
    const amd = index.manifests.find(
      (m) => m.platform?.architecture === 'amd64' && m.platform?.os === 'linux',
    );
    if (!amd) throw new Error('no amd64 manifest in index');
    // The index digest is what attestations attach to.
    indexDigest = await indexDigestOf(ref);
    manifest = await raw(`${repo}@${amd.digest}`);
  } else {
    // Single-arch image (already a manifest).
    manifest = index;
    indexDigest = await indexDigestOf(ref);
  }

  // 2. Compressed size = sum of layer sizes from the amd64 manifest.
  if (Array.isArray(manifest.layers)) {
    meta.sizeBytes = manifest.layers.reduce((sum, l) => sum + (l.size || 0), 0);
  }

  // 3. Build timestamp from the config blob's .created.
  if (manifest.config?.digest) {
    try {
      const config = await raw(`${repo}@${manifest.config.digest}`);
      if (config.created) meta.builtISO = config.created;
    } catch (err) {
      // non-fatal: keep size, skip timestamp
      console.warn(`  ${ref}: config fetch failed (${err.message})`);
    }
  }

  // 4. SBOM package count (best effort, slower).
  if (!skipSbom && indexDigest) {
    try {
      const out = await run(
        'gh',
        [
          'attestation',
          'verify',
          `oci://${repo}@${indexDigest}`,
          '--owner',
          OWNER,
          '--predicate-type',
          SPDX,
          '--format',
          'json',
        ],
        90000,
      );
      const atts = JSON.parse(out);
      const pkgs = atts?.[0]?.verificationResult?.statement?.predicate?.packages;
      if (Array.isArray(pkgs) && pkgs.length > 0) meta.sbomPackages = pkgs.length;
    } catch (err) {
      console.warn(`  ${ref}: SBOM skipped (${err.message.split('\n')[0]})`);
    }
  }

  return meta;
}

// The digest of the OCI index/manifest the tag points at (attestations attach here).
async function indexDigestOf(ref) {
  const out = await run('docker', [
    'buildx',
    'imagetools',
    'inspect',
    ref,
    '--format',
    '{{json .Manifest.Digest}}',
  ]);
  return JSON.parse(out.trim());
}

async function main() {
  const images = JSON.parse(await readFile(join(root, 'src/data/images.json'), 'utf8'));
  let available = images.filter((i) => i.status === 'available');
  if (onlySlug) available = available.filter((i) => i.slug === onlySlug);

  // One task per (image, tag): metadata is captured separately for every
  // published version tag, so the result is nested slug -> tag -> meta.
  const tasks = available.flatMap((entry) => {
    const repo = entry.image || `ghcr.io/quenchworks/images/${entry.slug}`;
    return tagsOf(entry.version).map((tag) => ({ slug: entry.slug, repo, tag }));
  });
  console.log(`Fetching metadata for ${available.length} image(s), ${tasks.length} tag(s)...`);

  // Seed from the existing file so a partial run (some tags throttled) never
  // drops metadata we already had; successful fetches overwrite their entry.
  let out = {};
  try {
    out = JSON.parse(await readFile(join(root, 'src/data/image-meta.json'), 'utf8'));
    // Discard a legacy flat file (slug -> {sizeBytes}); we now nest slug -> tag.
    const looksFlat = Object.values(out).some((v) => v && typeof v.sizeBytes === 'number');
    if (looksFlat) out = {};
  } catch {
    out = {};
  }
  const failed = [];

  // Modest concurrency: registry + gh throttle if pushed too hard.
  const CONCURRENCY = 3;
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const { slug, repo, tag } = tasks[idx++];
      const key = tag ?? 'latest';
      try {
        const meta = await fetchTag(repo, tag);
        (out[slug] ||= {})[key] = meta;
        const parts = [];
        if (meta.sizeBytes != null) parts.push(`${(meta.sizeBytes / 1e6).toFixed(1)}MB`);
        if (meta.builtISO) parts.push(meta.builtISO.slice(0, 10));
        if (meta.sbomPackages != null) parts.push(`${meta.sbomPackages} pkgs`);
        console.log(`  ok  ${`${slug}:${key}`.padEnd(26)} ${parts.join('  ')}`);
      } catch (err) {
        failed.push(`${slug}:${key}`);
        console.warn(`  FAIL ${slug}:${key}: ${err.message.split('\n')[0]}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Stable key order (slugs, then version tags within each) for clean diffs.
  const sorted = {};
  for (const k of Object.keys(out).sort()) {
    const inner = out[k];
    sorted[k] = {};
    for (const v of Object.keys(inner).sort()) sorted[k][v] = inner[v];
  }

  const dest = join(root, 'src/data/image-meta.json');
  await writeFile(dest, JSON.stringify(sorted, null, 2) + '\n');
  const tagCount = Object.values(sorted).reduce((n, m) => n + Object.keys(m).length, 0);
  console.log(`\nWrote ${Object.keys(sorted).length} images / ${tagCount} tags to src/data/image-meta.json`);
  if (failed.length) console.warn(`Could not fetch: ${failed.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
