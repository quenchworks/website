// Build-time enrichment from the ArtifactHub API. ArtifactHub sends no CORS headers,
// so this runs server-side during `astro build` only -- never in the browser.
// If AH is unreachable, callers fall back to static catalog values so a deploy never breaks.

import securitySnapshot from './security.json';

const API = 'https://artifacthub.io/api/v1';
// AH repository slug convention for this org: quench-<app>
const repoOf = (slug: string) => `quench-${slug}`;

// Per-image CVE summary from the committed snapshot (scripts/scan-images.mjs, nightly Trivy scan).
// Used everywhere instead of the rate-limited live call so the build never blanks.
function snapshotSecurity(name: string): { security?: SecuritySummary; securityTotal?: number } {
  const rec = (securitySnapshot as Record<string, any>)[name];
  if (!rec) return {};
  return {
    security: { critical: rec.critical, high: rec.high, medium: rec.medium, low: rec.low, unknown: rec.unknown },
    securityTotal: rec.total,
  };
}

export interface AhFacts {
  version: string;
  appVersion?: string;
  signed: boolean;
  signatures: string[];
  repo: string;
  url: string;
  ts?: number;
  // Live Trivy security summary from ArtifactHub (the search endpoint carries it),
  // so catalog cards can show a real CVE marker instead of a hardcoded claim.
  security?: SecuritySummary;
  securityTotal?: number;
}

// Lightweight: one search call -> map of package name -> basic facts (used by the
// index + cards + hero). Module-cached so the WHOLE build shares ONE request.
// CVE counts come from the committed security.json snapshot (overlaid below), NOT
// this live call -- the build renders pages in parallel and the live call often
// 429s, which would blank the catalog. version/signed are best-effort live.
let searchCache: Promise<Record<string, AhFacts>> | null = null;
export function fetchArtifactHub(): Promise<Record<string, AhFacts>> {
  if (!searchCache) searchCache = fetchArtifactHubUncached();
  return searchCache;
}

async function fetchArtifactHubUncached(): Promise<Record<string, AhFacts>> {
  const out: Record<string, AhFacts> = {};
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // AH caps limit at 60; that's enough for the live version/signed enrichment
      // (security is overlaid from security.json regardless).
      const res = await fetch(`${API}/packages/search?ts_query_web=quenchworks&kind=0&limit=60`, {
        headers: { accept: 'application/json' },
      });
      if (res.ok) {
        const data = (await res.json()) as { packages?: any[] };
        for (const p of data.packages ?? []) {
          const repo = p.repository?.name ?? '';
          out[p.name] = {
            version: p.version,
            appVersion: p.app_version,
            signed: Boolean(p.signed),
            signatures: p.signatures ?? [],
            repo,
            url: `${API.replace('/api/v1', '')}/packages/helm/${repo}/${p.name}`,
            ts: p.ts,
          };
        }
        break;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
  // Overlay the committed CVE snapshot so every package has reliable security data
  // even when the live call was rate-limited or returned a subset.
  for (const name of Object.keys(securitySnapshot as Record<string, any>)) {
    out[name] = {
      ...(out[name] ?? { signed: true, signatures: [], repo: repoOf(name), url: '', version: '' }),
      ...snapshotSecurity(name),
    };
  }
  return out;
}

export interface SecuritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  unknown: number;
}

export interface AhDetail {
  version?: string;
  appVersion?: string;
  signed: boolean;
  signatures: string[];
  contentUrl?: string;
  chartLicense?: string;
  hasValuesSchema: boolean;
  image?: string; // digest-pinned image the chart deploys
  security?: SecuritySummary;
  securityTotal?: number;
  scannedAt?: number;
  versions: { version: string; ts?: number }[];
  signKeyUrl?: string;
  ts?: number;
  url?: string; // ArtifactHub page
}

// Build-time memo: every detail page (chart base, chart per-version, image,
// runtime) calls fetchPackageDetail for the same slug, and the per-version chart
// route would otherwise fan out one request per chart all at once. Caching the
// in-flight promise per slug collapses that to a single request per slug for the
// whole build, which also avoids ArtifactHub rate-limiting that would drop the
// version history (and leave the switcher pointing at non-existent pages).
const detailCache = new Map<string, Promise<AhDetail | null>>();

// Rich: full per-package endpoint for one chart's detail page.
export function fetchPackageDetail(slug: string): Promise<AhDetail | null> {
  const cached = detailCache.get(slug);
  if (cached) return cached;
  const p = fetchPackageDetailUncached(slug);
  detailCache.set(slug, p);
  return p;
}

async function fetchPackageDetailUncached(slug: string): Promise<AhDetail | null> {
  const repo = repoOf(slug);
  try {
    const res = await fetch(`${API}/packages/helm/${repo}/${slug}`, {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const d = (await res.json()) as any;
    const sec: SecuritySummary | undefined = d.security_report_summary
      ? {
          critical: d.security_report_summary.critical ?? 0,
          high: d.security_report_summary.high ?? 0,
          medium: d.security_report_summary.medium ?? 0,
          low: d.security_report_summary.low ?? 0,
          unknown: d.security_report_summary.unknown ?? 0,
        }
      : undefined;
    return {
      version: d.version,
      appVersion: d.app_version,
      signed: Boolean(d.signed),
      signatures: d.signatures ?? [],
      contentUrl: d.content_url,
      chartLicense: d.license,
      hasValuesSchema: Boolean(d.has_values_schema),
      image: (d.containers_images ?? [])[0]?.image,
      // Prefer the committed snapshot (reliable) over the live (rate-limited) summary.
      security: snapshotSecurity(slug).security ?? sec,
      securityTotal: snapshotSecurity(slug).securityTotal ?? (sec ? sec.critical + sec.high + sec.medium + sec.low + sec.unknown : undefined),
      scannedAt: d.security_report_created_at,
      versions: (d.available_versions ?? []).map((v: any) => ({ version: v.version, ts: v.ts })),
      signKeyUrl: d.sign_key?.url,
      ts: d.ts,
      url: `${API.replace('/api/v1', '')}/packages/helm/${repo}/${slug}`,
    };
  } catch {
    return null;
  }
}
