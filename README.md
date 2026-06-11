# Quenchworks — Website

Landing page for [Quenchworks](https://github.com/quenchworks) — hardened, 0-CVE Helm charts and
container images.

Built with **Astro 5 · Tailwind CSS v4 · TypeScript**, managed with **pnpm**. Node **26** (see
`.nvmrc`). The design follows the authoritative theme in
[`_plan-artifacts/design-system/MASTER.md`](../_plan-artifacts/design-system/MASTER.md) — monochrome
(ink/paper), Inter + JetBrains Mono.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # astro + TypeScript checks
pnpm build      # static output to dist/
pnpm preview    # preview the production build
```

## Structure

```
src/
  styles/global.css     # Tailwind v4 + @theme design tokens (the enforced palette)
  layouts/Base.astro    # <head>, fonts, SEO/OG
  components/           # Header · Hero · Features · Cta · Footer
  pages/index.astro     # the single landing page
public/
  brand/                # logo + icon (light/dark)
  favicon.svg
```

## Theme

All color and type come from tokens in `src/styles/global.css` (`@theme`). Don't hardcode hex in
components — use the `ink` / `graphite` / `line` / `ash` / `paper` utilities so the whole site stays
consistent. Monochrome only; no color accent.

## Deploy

Static build (`pnpm build` → `dist/`), deployed to **Cloudflare Pages** via Cloudflare's Git
integration (Cloudflare builds on push — no GitHub Actions workflow needed). Project settings:

- Build command: `pnpm build`
- Build output directory: `dist`
- Framework preset: Astro
- Node version: `26` (set `NODE_VERSION=26` in the Pages env, matching `.nvmrc`)
- Custom domain: `quenchworks.mkabumattar.com`
