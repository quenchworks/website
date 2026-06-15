import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import AutoImport from 'astro-auto-import';
import astroExpressiveCode from 'astro-expressive-code';
import images from './src/data/images.json' with { type: 'json' };

// The runtime/base/tool images moved out of /images into /runtimes. Keep every
// old per-image link alive by mapping /images/<slug> -> /runtimes/<slug> for each
// moved slug. Built from the catalog data so it never drifts from the move.
const RUNTIME_CATEGORIES = new Set(['Language runtime', 'Runtime base', 'Build tool']);
const runtimeRedirects = Object.fromEntries(
  images
    .filter((i) => RUNTIME_CATEGORIES.has(i.category) && i.status === 'available')
    .map((i) => [`/images/${i.slug}`, `/runtimes/${i.slug}`]),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://quenchworks.mkabumattar.com',
  integrations: [
    // Auto-import the docs shortcodes so MDX can use them without per-file
    // import lines. AutoImport MUST come before mdx() so the imports are
    // injected before MDX compiles each page.
    AutoImport({
      imports: [
        './src/components/shortcodes/Notice.astro',
        './src/components/shortcodes/Steps.astro',
        './src/components/shortcodes/Tabs.astro',
        './src/components/shortcodes/Tab.astro',
        './src/components/shortcodes/Kbd.astro',
        './src/components/shortcodes/Card.astro',
        './src/components/shortcodes/CardGrid.astro',
        './src/components/shortcodes/FileTree.astro',
        './src/components/shortcodes/Badge.astro',
      ],
    }),
    // Expressive Code must precede mdx() so it can pre-process fenced code
    // blocks before MDX compiles each page. Config lives in ec.config.mjs.
    astroExpressiveCode(),
    mdx(),
    sitemap(),
  ],
  // Prefetch internal links on hover so navigation across the catalog feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // The combined /catalog section is retired in favour of dedicated /charts + /images.
  // Keep old links alive: /catalog -> /charts, and per-app /catalog/<slug> -> /charts/<slug>.
  redirects: {
    '/catalog': '/charts',
    '/catalog/[slug]': '/charts/[slug]',
    ...runtimeRedirects,
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@xt0rted/expressive-code-file-icons'],
    },
  },
});
