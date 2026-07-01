---
target: homepage (src/pages/index.astro)
total_score: 32
p0_count: 0
p1_count: 2
timestamp: 2026-07-01T06-41-33Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design-review · B: detector) — browser visualization unavailable (headless session)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Hero "1 open CVE" (live) vs Features "0 fixable CVEs" not reconciled on-page |
| 2 | Match System / Real World | 4 | Engineer-native throughout (helm install, cosign verify, digest, SLSA) |
| 3 | User Control and Freedom | 3 | No skip-to-content; hero terminal is a mobile h-scroll trap |
| 4 | Consistency and Standards | 3 | Eyebrow on some sections not others; rounded-xl vs rounded-2xl drift |
| 5 | Error Prevention | 3 | Copy button catch{} fails silently, no feedback |
| 6 | Recognition Rather Than Recall | 3 | 7 nav items, all low-contrast uppercase mono |
| 7 | Flexibility and Efficiency | 4 | ⌘K search, copy-on-every-pre, paste-ready verify commands |
| 8 | Aesthetic and Minimalist | 4 | Strongest axis; nothing decorative competes with evidence |
| 9 | Error Recovery | 2 | No user-facing error/help affordance if live fetch fails |
| 10 | Help and Documentation | 3 | Docs/FAQ/How-it-works linked; terminal card unexplained for newcomers |
| **Total** | | **32/40** | **Strong** |

## Anti-Patterns Verdict

**Does this look AI-generated? No.** A skeptic would say "someone who cares made this" — which is the positioning win.

**LLM assessment:** Every DESIGN.md ban survives contact with the build — no gradient text, no decorative glass (blur only on sticky header + search backdrop), no cream bg, no side-stripes, no numbered scaffolding, bento asymmetry instead of identical card grids, one functional color (amber CVE count). The ONE real tell: a mono-uppercase **eyebrow on 3 of 5 body sections** (Demo/Features/Catalog) — the exact pattern PRODUCT.md + DESIGN.md name as the generic-SaaS anti-reference. It's the house mono-label style over-applying itself: the system violating its own named ban.

**Deterministic scan (detect.mjs):** Homepage `dist/index.html` = **exit 0, zero findings**. Two hits on adjacent pages, both non-issues for the homepage: `numbered-section-markers` on /images = **false positive** (SVG coords + Tailwind `size-11` integers, not editorial markers); `em-dash-overuse` on /security = count inflated by CLI flags/comments but **4 genuine prose em-dashes** remain (worth a later clarify pass on that page).

**Visual overlays:** unavailable — headless session, no browser injection.

## Overall Impression

A disciplined, credible surface that does the rare thing: it practices its own principles. The hero `cosign verify` command IS the pitch — "verify us, don't trust us" in the user's own syntax. Biggest single opportunity: stop spending credibility where the page currently leaks it (the "★ 2" star count and the unreconciled CVE numbers), and stop the one reflex (the repeated eyebrow) that contradicts the brand's stated restraint.

## What's Working

1. **The hero terminal card is the whole pitch in 6 lines** — a real `cosign verify --certificate-identity-regexp …`, not a paraphrase. Turns "show the receipts" into a copy-pasteable artifact.
2. **Token discipline is real, not claimed** — composed HTML is grep-clean of every ban; Border-Not-Shadow and Monochrome rules survived implementation.
3. **Live, non-hardcoded evidence** — counts + CVE totals derive from synced data with a safe static fallback; the numbers can't drift from what shipped.

## Priority Issues

- **[P1] Per-section uppercase eyebrow violates the site's own named ban.** Demo/Features/Catalog each open with the identical `font-mono uppercase tracking-[0.25em]` eyebrow. *Why:* it's the one place the surface reads as template, and DESIGN.md §6 explicitly forbids it. *Fix:* drop it on ≥2 of 3; let the headline carry the section. *Command:* `/impeccable distill`
- **[P1] "★ 2" GitHub stat is a trust valley in the hero's first line.** *Why:* a skeptical platform engineer reads 2 stars as "unadopted / bus-factor risk" — the metric-flex slot displaying the project's weakest number. *Fix:* gate it behind a threshold (the `githubStars !== null` guard makes this trivial) or replace with a stronger existing signal (image/chart count, last-built recency). *Command:* `/impeccable harden`
- **[P2] CVE claim inconsistency: "1 open CVE" (hero) vs "0 fixable CVEs" (Features).** *Why:* a verifier reads both in one scroll; open≠fixable but the page never says so, and this brand's equity IS "our numbers are true." *Fix:* distinguish the terms on-page ("1 open (unfixable) CVE" / tooltip). *Command:* `/impeccable clarify`
- **[P2] Catalog 28-tile grid: no grouping, exceeds scan load, duplicate category labels.** *Why:* 28 undifferentiated tiles sorted by count; taxonomy noise ("Search" vs "Search & vector" vs "Vector"; "Secrets" vs "Secrets & identity"). *Fix:* group under the buckets the prose already names or top-N + "more"; de-dupe categories upstream. *Command:* `/impeccable clarify`
- **[P3] No skip-link; mobile hero terminal is a silent h-scroll trap.** *Why:* WCAG-AA target + keyboard nav — skip-link is table stakes; the best trust artifact is partly off-screen on mobile with no cue. *Fix:* visually-hidden skip link in Base.astro; scroll cue / soft-wrap for the terminal `<sm`. *Command:* `/impeccable harden`

## Persona Red Flags

- **Jordan (first-timer):** hero `cosign verify` shown with zero explanation of what cosign is; Wolfi/melange/apko/SLSA density with no glossary → newcomer bounces. (Acceptable given expert persona, but a real adjacent edge.)
- **Riley (stress-tester):** the "1 open CVE"/"0 fixable" gap is exactly what they click to disprove; "★ 2" invites "nobody trusts this yet"; silent clipboard `catch{}` reads as a broken button.
- **Casey (mobile):** hero terminal h-scrolls the long cosign line with no affordance → may never see the page's best asset; 28-tile grid = 14 rows of near-identical cells on phone. (Tap targets correctly 44px+.)
- **Skeptical platform engineer (project persona):** mostly served — real verify command, live totals, digest-pinning explained. Fails: the CVE mismatch is precisely their probe; "★ 2" reads unproven; "multi-arch" and "digest-pinned" are asserted as text while only "signed" gets a runnable receipt — a small breach of the "every claim beside its receipt" North Star.

## Minor Observations

- Radius drift: cards `rounded-xl` (per system) vs Demo/search-modal `rounded-2xl` (no 2xl token in DESIGN.md).
- Hero subhead leads with "datastores" but the catalog spans observability/gateways/registry/base images — undersells breadth.
- Nice restraint: hero traffic-light dots are monochrome outlines, dodging the macOS cliché; only one functional color on the page.
- Footer "not affiliated with any upstream vendor" is a quiet, credible clean-room signal.

## Questions to Consider

1. If "the catalog is the pitch," why does a skeptic scroll Demo + Features + a 28-tile teaser before a single real catalog entry with its own live grade/digest?
2. Three of four hero claims (0-CVE, multi-arch, digest-pinned) are asserted as text; only "signed" has a runnable receipt. Which other claim deserves its own copy-pasteable proof?
3. Has JetBrains-mono-uppercase (nav, chips, eyebrows, stats, footers, versions) quietly become the decorative default — the very reflex the monochrome system was meant to prevent?
