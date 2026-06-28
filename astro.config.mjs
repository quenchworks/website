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
      // The /alternative section is English-only. The i18n integration otherwise
      // attaches ar/es hreflang alternates to every URL, which would point at
      // pages that don't exist. Drop the phantom localized locs and trim the
      // alternates on the real /alternative pages to just en.
      serialize(item) {
        if (/\/(ar|es)\/alternative(\/|$)/.test(item.url)) return undefined;
        if (item.url.includes("/alternative") && item.links) {
          item.links = item.links.filter((l) => l.lang === "en");
        }
        return item;
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
    // The bespoke Bitnami page is now one of the data-driven /alternative/<vendor>
    // pages; keep the old URL (and its localized variants) alive.
    "/bitnami-alternative": "/alternative/bitnami",
    "/ar/bitnami-alternative": "/alternative/bitnami",
    "/es/bitnami-alternative": "/alternative/bitnami",
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@xt0rted/expressive-code-file-icons"],
    },
  },
});
