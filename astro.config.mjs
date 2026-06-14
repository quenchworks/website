import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://quenchworks.mkabumattar.com',
  integrations: [sitemap()],
  // Prefetch internal links on hover so navigation across the catalog feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // The combined /catalog section is retired in favour of dedicated /charts + /images.
  // Keep old links alive: /catalog -> /charts, and per-app /catalog/<slug> -> /charts/<slug>.
  redirects: {
    '/catalog': '/charts',
    '/catalog/[slug]': '/charts/[slug]',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
