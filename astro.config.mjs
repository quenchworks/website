import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://quenchworks.mkabumattar.com',
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
