---
name: QuenchWorks
description: Monochrome, terminal-native dark system for a verifiable 0-CVE image & chart catalog.
colors:
  ink: "#0b0b0c"
  graphite: "#141417"
  line: "#26262b"
  ash: "#b0b0ba"
  paper: "#fafafa"
  status-ok: "#10b981"
  status-warn: "#f59e0b"
  status-bad: "#ef4444"
typography:
  display:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  button-ghost:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  card:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ash}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    typography: "{typography.label}"
  nav-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ash}"
    typography: "{typography.label}"
---

# Design System: QuenchWorks

## 1. Overview

**Creative North Star: "The Ledger of Receipts"**

QuenchWorks is a verifiable catalog, not a sales page, and the system reads like an
audit trail: every claim sits next to the artifact that proves it — a sha256 digest,
a Trivy grade, a cosign signature, a live CVE count. The surface is a dark, matte,
terminal-native monochrome; energy comes from high contrast, decisive typography, and
tabular precision, never from hue. Numbers line up. Metadata is set in monospace like
a log line. Nothing decorative competes with the evidence.

It is built for a skeptical platform engineer with a terminal open in the next tab, so
it commits to restraint as a credibility signal: the absence of hype IS the positioning.
This system explicitly rejects the **generic-SaaS** playbook (gradient hero, cream/sand
background, the hero-metric template, identical icon-card grids, an uppercase eyebrow
above every section); the **corporate/enterprise-vendor** look it replaces (heavy chrome,
stock imagery, "contact sales"); anything **playful/consumer** (mascots, bright multi-color);
and the **crypto/AI-hype-dark** cliché (neon-on-black, decorative glassmorphism, gradient
text). Dark here is quiet command, not spectacle.

**Key Characteristics:**
- Monochrome ink + paper + neutral ramp; color appears only to encode security severity.
- Inter for structure, JetBrains Mono for every piece of metadata, code, and label.
- Flat by default — depth comes from tonal surfaces and 1px borders, never shadow.
- Tabular figures everywhere numbers appear (versions, CVE counts, sizes).
- WCAG-AA verified; keyboard, reduced-motion, increased-contrast, and RTL all first-class.

## 2. Colors

A single monochrome ramp from near-black to near-white, plus one functional traffic-light trio reserved strictly for security state.

### Primary
- **Paper** (`#fafafa`): primary text and the inverted-fill CTA. The brightest ink on the page; used for anything that must be read first.

### Neutral
- **Ink** (`#0b0b0c`): the page background. Near-black, chroma-free — the matte base the whole system sits on.
- **Graphite** (`#141417`): surfaces and cards. One step up from ink; the only way a container separates from the page (no shadow does it).
- **Line** (`#26262b`): borders and dividers. Every card, chip, and section edge is a 1px line, not a shadow.
- **Ash** (`#b0b0ba`): muted / secondary text, labels, and metadata. Tuned to 9.15:1 on ink and 8.55:1 on graphite so even `ash/70` clears 4.5:1.

### Tertiary (functional status only)
- **Status OK** (`#10b981`, emerald): rendered as a `/10` fill + `/40` border + `-300` text on the CVE grade chip when an image is clean (A+/A).
- **Status Warn** (`#f59e0b`, amber): the same chip treatment for medium/low severity (grade B/C).
- **Status Bad** (`#ef4444`, red): the same treatment for high/critical (grade D/F).

### Named Rules
**The Monochrome Rule.** The brand is ink + paper + the neutral ramp. No decorative hue, no brand accent color. Energy is contrast and type, never color. If a swatch isn't in the neutral ramp, it must be justified as security state.

**The Functional-Color-Only Rule.** The emerald/amber/red trio appears ONLY to encode CVE severity, and it is never the sole signal — the letter grade (A+ → F) and an aria-label always carry the same meaning as text. Color that isn't encoding severity is prohibited.

## 3. Typography

**Display Font:** Inter Variable (with Inter, system-ui fallback)
**Body Font:** Inter Variable
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace fallback)

**Character:** One humanist-sans workhorse across the whole hierarchy, paired on a contrast axis with a mechanical monospace that carries every piece of machine metadata. Inter states things; JetBrains Mono timestamps and versions them. The split is semantic, not decorative — prose is Inter, anything a machine emitted is mono.

### Hierarchy
- **Display** (Inter 700, `clamp(2.25rem, 5vw, 3.75rem)`, 1.05, -0.02em): page/hero headlines only. Tight tracking; never exceeds ~3.75rem.
- **Headline** (Inter 600, 1.5rem, 1.2): section headings.
- **Title** (Inter 600, 1.125rem, 1.3): card names, sub-section titles.
- **Body** (Inter 400, 1rem, 1.6): prose; capped at 65–75ch measure.
- **Label** (JetBrains Mono 500, 0.6875rem, +0.1em, UPPERCASE): eyebrows, nav links, chips, versions, code, stats.

### Named Rules
**The Mono-for-Metadata Rule.** JetBrains Mono is reserved for machine-adjacent text: versions, digests, CVE counts, labels, nav, code. It is not a decorative display face. Prose is always Inter.

**The Tabular Rule.** Any digit that could shift between renders — versions, CVE counts, sizes, scores — uses tabular figures so columns never jitter.

## 4. Elevation

Flat by default. There are no drop shadows anywhere in the system. Depth is expressed tonally: `ink` is the page, `graphite` is a surface one step lighter, and a 1px `line` border draws every edge. A card is "raised" because it is a lighter tone inside a border, not because it floats.

### Named Rules
**The Border-Not-Shadow Rule.** Separation is a 1px `line` border and a tonal step (ink → graphite), never a `box-shadow`. If a surface needs to feel distinct, lighten its tone or draw its border — do not add a shadow.

**The State-Reveals-Depth Rule.** At rest, surfaces are flat. The only "lift" is a state change: on hover a card's border shifts from `line` to `paper/40`. Motion and border, not elevation, signal interactivity.

## 5. Components

Precise and restrained — sharp edges of information on quiet surfaces, nothing decorative, density only where it earns its place.

### Buttons
- **Shape:** gently rounded (`rounded-lg`, 12px).
- **Primary:** inverted fill — `paper` background, `ink` text (≥7:1). Padding ~8px 14px. This is the one loud element; used once per view.
- **Ghost / Secondary:** transparent on `ink`, `paper` text, 1px `line` border. Hover shifts the border to `paper/40`.
- **Hover / Focus:** 150–300ms ease-out, hover scale ≤1.02; `:focus-visible` is a 2px `paper` outline with 2px offset — never removed.

### Chips / Badges
- **Style:** JetBrains Mono, uppercase, `text-[10px]`, 1px border, `rounded` (4px), `px-2 py-0.5`. Default is `ash` text on `ink` inside a `line` border (category / tier / license tags).
- **CVE status chip (signature):** leads with the letter grade (A+ → F), count alongside; colored by the functional trio (`/10` fill, `/40` border, `-300` text) — green clean, amber medium/low, red high/critical. Grade is always text; color never stands alone.

### Cards / Containers
- **Corner Style:** `rounded-xl` (16px).
- **Background:** `graphite` on the `ink` page.
- **Shadow Strategy:** none — see Elevation. Tonal step + border only.
- **Border:** 1px `line`; hover → `paper/40`.
- **Internal Padding:** 20px (`p-5`). Never nest a card inside a card.

### Inputs / Fields
- **Style:** `graphite` fill, 1px `line` border, `rounded-lg`; monospace for query/code inputs where it fits.
- **Focus:** the global 2px `paper` `:focus-visible` ring, offset 2px.

### Navigation
- **Style:** JetBrains Mono, uppercase, `text-xs`, `+0.1em` tracking. Links are `ash`, hover/active → `paper`. Header is a thin bar on `ink` with a bottom `line` border; the layered-cube mark sits left.

## 6. Do's and Don'ts

### Do:
- **Do** keep the surface monochrome (ink `#0b0b0c` / graphite `#141417` / line `#26262b` / ash `#b0b0ba` / paper `#fafafa`); carry energy with contrast and type.
- **Do** make the CTA an inverted `paper`-on-`ink` fill, used once per view; everything else is ghost or text.
- **Do** draw separation with full 1px `line` borders and tonal steps; keep surfaces flat.
- **Do** set all metadata (versions, digests, CVE counts, labels) in JetBrains Mono with tabular figures.
- **Do** back every status color with a text grade + aria-label; honor `prefers-reduced-motion` and `prefers-contrast`.

### Don't:
- **Don't** introduce a decorative brand accent or any hue that isn't encoding security severity (**The Monochrome Rule**).
- **Don't** use gradient text (`background-clip: text`), decorative glassmorphism, or neon-on-black — the **crypto/AI-hype-dark** cliché is forbidden.
- **Don't** ship a **generic-SaaS** hero: no gradient hero, no cream/sand background, no hero-metric template, no identical icon-card grids, no uppercase eyebrow above every section.
- **Don't** adopt the **corporate/enterprise-vendor** look QuenchWorks replaces — no heavy chrome, stock imagery, or "contact sales" framing.
- **Don't** go **playful/consumer** — no mascots, bright multi-color, or illustration-heavy warmth.
- **Don't** use a `border-left`/`border-right` colored side-stripe as an accent, add drop shadows for depth, or nest cards inside cards.
