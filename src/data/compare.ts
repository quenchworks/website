// Single source of truth for the QuenchWorks-vs-providers comparison.
// Consumed by /compare (the full matrix) AND /alternative/[vendor] (one SEO
// landing per competitor). Keeping the data here means a fact is edited once
// and both surfaces update. English only — the matrix verdicts/notes are the
// canonical copy; /compare's ar/es pages keep their own translated tables.

// Vendor order; QuenchWorks stays first so it keeps the highlighted column.
// Each `cells` array below has one entry per vendor, in this same order.
export const vendors: string[] = ['QuenchWorks', 'Bitnami', 'Chainguard', 'Docker', 'RapidFort', 'Minimus'];

// Each cell is { v: short verdict, n?: short note }. Be factual, conservative, and fair.
// Where a fact could not be confirmed from a primary source, the verdict is hedged
// ("Varies", "Partial", "—") with a neutral note rather than a hard claim.
export type Cell = { v: string; n?: string };
export type Row = { label: string; cells: Cell[] };

export const rows: Row[] = [
  {
    label: 'Price / free tier',
    cells: [
      { v: 'Free' },
      { v: 'Paid', n: 'Bitnami Secure Images is commercial; a latest-only hardened community set and a frozen legacy registry remain' },
      { v: 'Freemium', n: 'A small set of Starter images is free; the full catalog is a paid subscription' },
      { v: 'Free', n: 'Docker Hardened Images opened as free, Apache-2.0 open source in Dec 2025' },
      { v: 'Varies', n: 'Commercial platform; public pricing for image access is not published' },
      { v: 'Paid', n: 'Commercial; a free open-source program exists for eligible projects' },
    ],
  },
  {
    label: 'Built from source on Wolfi',
    cells: [
      { v: 'Yes' },
      { v: 'No', n: 'Debian-based hardening, not Wolfi' },
      { v: 'Yes', n: 'Wolfi-based' },
      { v: 'No', n: 'Built on Debian and Alpine' },
      { v: 'No', n: 'Curated / optimized upstream images, not a Wolfi rebuild' },
      { v: 'No', n: 'Proprietary from-source build, not Wolfi' },
    ],
  },
  {
    label: '0-CVE goal with daily rebuilds',
    cells: [
      { v: 'Yes', n: 'Hard Trivy gate; a fixable CVE fails the build' },
      { v: 'Yes', n: 'Near-zero-CVE goal; cadence not publicly specified here' },
      { v: 'Yes', n: 'Near-zero-CVE goal with frequent rebuilds' },
      { v: 'Yes', n: 'Near-zero-CVE goal; paid tiers add a remediation SLA' },
      { v: 'Yes', n: 'Near-zero-CVE goal via continuous hardening' },
      { v: 'Yes', n: 'Near-zero-CVE goal; paid tiers add a remediation SLA' },
    ],
  },
  {
    label: 'Signed (cosign keyless)',
    cells: [
      { v: 'Yes' },
      { v: 'Yes', n: 'Signed images' },
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Yes', n: 'Cryptographic signing' },
      { v: 'Yes', n: 'Cosign signatures' },
    ],
  },
  {
    label: 'SBOM (SPDX or CycloneDX)',
    cells: [
      { v: 'Yes', n: 'SPDX' },
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Yes', n: 'SPDX and CycloneDX' },
      { v: 'Yes' },
      { v: 'Yes' },
    ],
  },
  {
    label: 'SLSA build provenance',
    cells: [
      { v: 'Yes' },
      { v: 'Partial', n: 'Attestations vary by offering' },
      { v: 'Yes', n: 'SLSA Build Level 2' },
      { v: 'Yes', n: 'SLSA Build Level 3' },
      { v: 'Yes', n: 'SLSA Level 3 (per vendor)' },
      { v: 'Yes', n: 'SLSA Level 3-aligned (per vendor)' },
    ],
  },
  {
    label: 'Multi-arch (amd64 + arm64)',
    cells: [
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Varies', n: 'Not confirmed across the catalog' },
      { v: 'Varies', n: 'Not confirmed from a primary source' },
    ],
  },
  {
    label: 'Helm charts included',
    cells: [
      { v: 'Yes' },
      { v: 'Yes', n: 'Behind the paid catalog' },
      { v: 'No', n: 'Images focused' },
      { v: 'Yes' },
      { v: 'Partial', n: 'Charts-compatible images; integrates with existing charts' },
      { v: 'Yes', n: 'Helm charts offered' },
    ],
  },
  {
    label: 'Charts pin images by digest',
    cells: [
      { v: 'Yes' },
      { v: 'Varies', n: 'Not confirmed here' },
      { v: 'n/a' },
      { v: 'Varies', n: 'Not confirmed here' },
      { v: 'n/a', n: 'No first-party charts' },
      { v: 'Varies', n: 'Not confirmed here' },
    ],
  },
  {
    label: 'License transparency, clean alternatives flagged',
    cells: [
      { v: 'Yes', n: 'Source-available apps are labeled, with an OSI-clean alternative named' },
      { v: 'Partial' },
      { v: 'Partial' },
      { v: 'Partial' },
      { v: 'Partial' },
      { v: 'Partial' },
    ],
  },
  {
    label: 'Open and free to verify',
    cells: [
      { v: 'Yes', n: 'Public images, charts, and build workflows' },
      { v: 'Partial', n: 'Full catalog gated behind a subscription' },
      { v: 'Partial', n: 'Full catalog gated behind a subscription' },
      { v: 'Yes', n: 'Free, open-source catalog with public attestations' },
      { v: 'Partial', n: 'Commercial platform; not a fully open catalog' },
      { v: 'Partial', n: 'Commercial; open-source program for eligible projects' },
    ],
  },
];

// Group the flat capability list into thematic sections so the table reads as
// a structured comparison, not one long list. Mapping is by row label, so the
// row data above stays the single source of truth.
export const groupOrder = ['Access & cost', 'Build & hardening', 'Supply chain', 'Charts & licensing'] as const;
export const rowGroup: Record<string, (typeof groupOrder)[number]> = {
  'Price / free tier': 'Access & cost',
  'Open and free to verify': 'Access & cost',
  'Built from source on Wolfi': 'Build & hardening',
  '0-CVE goal with daily rebuilds': 'Build & hardening',
  'Multi-arch (amd64 + arm64)': 'Build & hardening',
  'Signed (cosign keyless)': 'Supply chain',
  'SBOM (SPDX or CycloneDX)': 'Supply chain',
  'SLSA build provenance': 'Supply chain',
  'Helm charts included': 'Charts & licensing',
  'Charts pin images by digest': 'Charts & licensing',
  'License transparency, clean alternatives flagged': 'Charts & licensing',
};
export const groupedRows = groupOrder.map((title) => ({ title, rows: rows.filter((r) => rowGroup[r.label] === title) }));

// Pick a visual treatment per verdict word without adding any color accent.
export function tone(v: string): string {
  const yes = v.toLowerCase();
  if (yes === 'yes' || yes === 'free') return 'text-paper';
  // Everything else (No, Paid, Partial, Varies, Freemium, n/a, —) is muted.
  return 'text-ash';
}

// The handful of things that set QuenchWorks apart, called out above the grid.
export const differentiators: { label: string; body: string }[] = [
  { label: 'Free, no account', body: 'Pull images and deploy charts with no subscription, no login, and no registry to add.' },
  { label: 'Fully public, verifiable', body: 'Images, charts, and the proof (SBOM and SLSA provenance) are public for anyone to check.' },
  { label: 'Charts pinned by digest', body: 'Signed Helm charts reference their image by sha256, never a moving tag.' },
  { label: 'License honesty', body: 'Source-available apps are labeled as such, each with an OSI-clean alternative named.' },
];

// One-line, neutral snapshot per vendor (same order as `vendors`); tier drives the pill.
export const vendorMeta: { name: string; tier: string; blurb: string }[] = [
  { name: 'QuenchWorks', tier: 'Free', blurb: 'Independent, fully public hardened catalog. Wolfi-built images and signed Helm charts pinned by digest, no account needed.' },
  { name: 'Bitnami', tier: 'Paid', blurb: "Broadcom's commercial Bitnami Secure Images. The free community catalog was retired, leaving a frozen legacy registry behind." },
  { name: 'Chainguard', tier: 'Freemium', blurb: 'Premium Wolfi-based minimal images. A small Starter set is free; the full catalog is a paid subscription.' },
  { name: 'Docker', tier: 'Free', blurb: 'Docker Hardened Images, opened as a free, Apache-2.0 open-source catalog in late 2025. Built on Debian and Alpine.' },
  { name: 'RapidFort', tier: 'Varies', blurb: 'Curated, optimized images that strip attack surface from upstream containers. Commercial platform.' },
  { name: 'Minimus', tier: 'Paid', blurb: 'Proprietary from-source minimal images. Commercial, with a free program for eligible open-source projects.' },
];

// Pill treatment for a price tier; monochrome, with Free carrying the emphasis.
export function pillTone(tier: string): string {
  return tier === 'Free' ? 'border-paper/40 text-paper' : 'border-line text-ash';
}

// URL slug for a vendor name (drives /alternative/<slug>).
export const vendorSlug = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Per-vendor lead copy for the /alternative/<vendor> landing pages. Bitnami gets
// the full Broadcom-paywall narrative; the rest get a concise, factual angle.
// Anything without an entry falls back to the vendor's vendorMeta blurb.
export const vendorIntro: Record<string, { headline: string; body: string }> = {
  bitnami: {
    headline: 'A free, signed replacement for Bitnami',
    body: 'Broadcom moved the free Bitnami secure-images catalog to a paid model in 2025, leaving teams that built on bitnami/* images and charts looking for a maintained, hardened replacement. QuenchWorks is that replacement: a free, MIT-licensed, clean-room catalog of 0-CVE container images and signed Helm charts. It is built independently from source on Wolfi — not a fork or copy of Bitnami charts — and every claim is yours to verify.',
  },
  chainguard: {
    headline: 'A fully-free alternative to Chainguard',
    body: 'Chainguard ships excellent Wolfi-based minimal images, but the full catalog sits behind a paid subscription and a small free Starter set. QuenchWorks is also Wolfi-built and 0-CVE, but the entire catalog — images and signed Helm charts pinned by digest — is free, public, and needs no account.',
  },
  docker: {
    headline: 'QuenchWorks vs Docker Hardened Images',
    body: 'Docker Hardened Images opened as a free, Apache-2.0 catalog in late 2025, built on Debian and Alpine. QuenchWorks takes a different base — every app compiled from source on Wolfi — and ships first-party signed Helm charts that pin their image by digest, so the comparison is more about approach than price.',
  },
  rapidfort: {
    headline: 'A from-source alternative to RapidFort',
    body: 'RapidFort curates and optimizes upstream images to strip attack surface, as a commercial platform. QuenchWorks instead builds each app from source on Wolfi to a 0-CVE gate and ships signed Helm charts pinned by digest — free, public, and fully verifiable.',
  },
  minimus: {
    headline: 'A free, open alternative to Minimus',
    body: 'Minimus ships proprietary from-source minimal images as a commercial product, with a free program for eligible open-source projects. QuenchWorks is from-source and minimal too, but free for everyone, fully public, and shipped with signed Helm charts pinned by digest.',
  },
};
