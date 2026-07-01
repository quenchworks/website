# Product

## Register

brand

## Users

Platform and DevOps engineers, SREs, and security-conscious teams who run
containers on Kubernetes and are on the hook for what ships to production. They
arrive skeptical, evaluating whether QuenchWorks' hardened images and charts are
a credible replacement for the Bitnami catalog (or their own base images). Their
context is a browser tab open next to a terminal: they want to find an app,
verify it's actually 0-CVE and signed, read exactly how it's built, and copy a
pull/install command. The job is trust-then-adopt — they will not take a claim
on faith, so the site's job is to let them verify everything themselves.

## Product Purpose

The public face of QuenchWorks: a free, independent catalog of hardened, 0-CVE
container images and signed Helm charts, built from source on Wolfi, cosign-signed,
and pinned by digest. The site exists to make that catalog browsable and its
guarantees verifiable — per-image Trivy security grades, sha256 digests, SBOM and
SLSA provenance, an honest roadmap, and a live API. Success is an engineer landing
skeptical and leaving convinced enough to `helm install`, because the evidence was
in front of them, not because they were sold.

## Brand Personality

Technical, precise, trustworthy. Voice is engineer-to-engineer: plain, exact, and
low on marketing adjectives. It states what is true and shows the artifact that
proves it. Confidence comes from restraint and receipts, never from hype. Tone is
calm and declarative; the reader's time and skepticism are respected.

## Anti-references

- **Generic SaaS**: gradient hero, cream/sand background, the hero-metric template,
  identical icon-card grids, a tracked uppercase eyebrow above every section.
- **Corporate/enterprise vendor**: the Bitnami/VMware/big-vendor look QuenchWorks
  is replacing — heavy chrome, stock imagery, salesy framing, "contact sales".
- **Playful/consumer**: mascots, bright multi-color, illustration-heavy warmth that
  would undercut the security-serious credibility.
- **Crypto/AI-hype dark**: neon-on-black, decorative glassmorphism everywhere,
  gradient text — the other saturated "dark technical" cliché. Dark here is
  terminal-native restraint, not spectacle.

## Design Principles

- **Security as substance, not theater.** Every claim is backed by a verifiable
  artifact (live CVE counts, digests, signatures, SBOMs). No badge we can't prove.
- **Show the receipts.** Surface the real data — per-image Trivy grades, pinned
  digests, provenance — instead of asking to be trusted.
- **Engineer-to-engineer.** Copy and UI assume a technical, skeptical reader:
  precise, dense where density helps, no filler. Respect their time.
- **Restraint is the credibility signal.** Monochrome, quiet, typographic. The
  absence of hype IS the positioning against both the vendors and the hype-dark crowd.
- **The catalog is the pitch.** The browsable catalog, live security data, and honest
  roadmap do the selling; marketing pages support that evidence, never replace it.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body/muted text contrast is verified against the dark ramp
(ash is 9.15:1 on ink, 8.55:1 on graphite; `text-ash/70` stays ≥4.5:1). Full
keyboard navigation with visible `:focus-visible` rings; semantic HTML with
aria-labels + titles on non-text indicators (e.g. the CVE status chips convey
grade by text, never color alone). `prefers-reduced-motion` is honored (animations
collapse to near-instant) and `prefers-contrast: more` bumps muted text and borders.
Fully localized en / es / ar with correct RTL handling for Arabic.
