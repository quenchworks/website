import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import astroExpressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://quench-works.com",
  // i18n scaffold: `en` is the default and stays at the root (no prefix), so
  // every existing route keeps working unchanged. `ar` (RTL) and `es` live
  // under /ar and /es.
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar", "es"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // Docs MDX shortcodes (Steps, Notice, Tabs, ...) are provided to each page
    // via the native <Content components={shortcodes} /> prop in
    // src/pages/**/docs/[...slug].astro — see src/components/shortcodes/index.ts.
    // (Replaced astro-auto-import, which doesn't support Astro 7.)
    // Expressive Code must precede mdx() so it can pre-process fenced code
    // blocks before MDX compiles each page. Config lives in ec.config.mjs.
    astroExpressiveCode(),
    mdx(),
    // hreflang alternates in the sitemap, mirroring the i18n config above.
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", ar: "ar", es: "es" },
      },
    }),
  ],
  // Prefetch internal links on hover so navigation across the catalog feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // The combined /catalog section is retired in favour of dedicated /charts + /images.
  // Keep old links alive: /catalog -> /charts, and per-app /catalog/<slug> -> /charts/<slug>.
  redirects: {
    "/catalog": "/charts",
    "/catalog/[slug]": "/charts/[slug]",
    // The combined /runtimes section is retired in favour of dedicated /images.
    "/runtimes": "/images",
    "/runtimes/[slug]": "/images/[slug]",
    // The bare /api lands on the docs.
    "/api": "/api/docs",
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@xt0rted/expressive-code-file-icons"],
    },
  },
});
