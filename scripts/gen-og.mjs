// gen-og.mjs — generate per-app Open Graph images for the QuenchWorks website.
//
// Reads the app list from src/data/charts.json + src/data/images.json and writes
// one 1200x630 PNG per unique slug to public/og/<slug>.png, matching the brand
// template in public/og.svg (dot-grid bg, layered-cube mark, "QUENCHWORKS"
// wordmark, a big headline = the app name, a sub-line, and a mono ghcr line).
//
// Rasterized with rsvg-convert (same tool that produced public/og.png).
// Idempotent and re-runnable:  node scripts/gen-og.mjs

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'og');
const RSVG = '/usr/bin/rsvg-convert';

// Brand palette (from MEMORY / og.svg).
const INK = '#0b0b0c';
const LINE = '#26262b';
const PAPER = '#fafafa';
const ASH = '#9a9aa4';

/** Escape XML special characters for safe inclusion in SVG text. */
function xml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Read both data sets. Charts take precedence over images for shared metadata,
// but either source alone is enough to render a card.
const charts = JSON.parse(readFileSync(join(root, 'src/data/charts.json'), 'utf8'));
const images = JSON.parse(readFileSync(join(root, 'src/data/images.json'), 'utf8'));

/** Build a unified, de-duplicated map of slug -> card metadata. */
const apps = new Map();
for (const e of images) {
  if (!apps.has(e.slug)) {
    apps.set(e.slug, { slug: e.slug, name: e.name, category: e.category, kind: 'image' });
  }
}
for (const e of charts) {
  // Charts win: a slug with a chart is the richer, install-able artifact.
  apps.set(e.slug, { slug: e.slug, name: e.name, category: e.category, kind: 'chart' });
}

/**
 * Pick a headline font size so the (longest) app name fits within the card
 * width. Inter 700 averages ~0.56em per glyph; budget ~1040px of usable width.
 */
function headlineSize(name) {
  const budget = 1040;
  for (const size of [120, 104, 92, 80, 70, 62, 54, 48]) {
    if (name.length * size * 0.56 <= budget) return size;
  }
  return 44;
}

/** Build the per-app OG SVG from the brand template. */
function buildSvg(app) {
  const name = app.name || app.slug;
  const size = headlineSize(name);
  // Vertically center the headline baseline relative to its font size.
  const headlineY = 360 + size * 0.34;
  const ghcrPath =
    app.kind === 'chart'
      ? `ghcr.io/quenchworks/charts/${app.slug}`
      : `ghcr.io/quenchworks/images/${app.slug}`;
  const sub = app.category ? `${xml(app.category)}  ·  hardened · 0-CVE · signed` : 'hardened · 0-CVE · signed';

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${PAPER}" fill-opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="${LINE}" stroke-width="1"/>

  <!-- layered-cube mark -->
  <g transform="translate(80,76) scale(2.1)" fill="none" stroke="${PAPER}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
  </g>
  <text x="138" y="108" font-family="'JetBrains Mono', monospace" font-size="26" font-weight="600" letter-spacing="6" fill="${PAPER}">QUENCHWORKS</text>

  <text x="80" y="${headlineY}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="${size}" font-weight="700" fill="${PAPER}">${xml(name)}</text>

  <text x="82" y="452" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="30" font-weight="400" fill="${ASH}">${sub}</text>

  <text x="80" y="566" font-family="'JetBrains Mono', monospace" font-size="24" font-weight="500" letter-spacing="1" fill="${PAPER}">${xml(ghcrPath)}</text>
</svg>
`;
}

mkdirSync(outDir, { recursive: true });

let count = 0;
for (const app of apps.values()) {
  const svg = buildSvg(app);
  const tmp = join(tmpdir(), `qw-og-${app.slug}.svg`);
  writeFileSync(tmp, svg);
  try {
    execFileSync(RSVG, ['-w', '1200', '-h', '630', tmp, '-o', join(outDir, `${app.slug}.png`)]);
    count++;
  } finally {
    rmSync(tmp, { force: true });
  }
}

console.log(`Generated ${count} OG image(s) into public/og/`);
