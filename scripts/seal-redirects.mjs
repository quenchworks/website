// seal-redirects.mjs — wrap Astro's redirect stub pages in <html> so Pagefind
// stops warning ("185 pages found without an <html> element").
//
// Astro 7 emits redirect pages as a bare `<!doctype html><title>…<meta refresh>…
// <body>…` with no <html> element. They must stay in dist for the legacy
// /catalog and /runtimes links to keep redirecting, but Pagefind can't parse a
// page without an <html> root. We give each one an <html data-pagefind-ignore>
// wrapper: valid for Pagefind, and never indexed. Runs between `astro build`
// and `pagefind` (see package.json build script).

import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "dist");

function* htmlFiles(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

let sealed = 0;
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, "utf8");
  // Only Astro redirect stubs: a meta-refresh page with no <html> root.
  if (!html.includes('http-equiv="refresh"')) continue;
  if (/<html[\s>]/i.test(html)) continue;
  const wrapped =
    html.replace(/<!doctype html>/i, '<!doctype html><html lang="en" data-pagefind-ignore>') + "</html>";
  writeFileSync(file, wrapped);
  sealed++;
}
console.log(`seal-redirects: wrapped ${sealed} redirect stub(s) in <html>.`);
