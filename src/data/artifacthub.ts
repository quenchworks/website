// Build-time enrichment from the ArtifactHub API. ArtifactHub sends no CORS headers,
// so this runs server-side during `astro build` only -- never in the browser.
// If AH is unreachable, callers fall back to static catalog values so a deploy never breaks.

const API = 'https://artifacthub.io/api/v1';
// AH repository slug convention for this org: quench-<app>
const repoOf = (slug: string) => `quench-${slug}`;

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

// Normalize ArtifactHub's security_report_summary into our shape + a total.
function parseSecurity(raw: any): { security?: SecuritySummary; securityTotal?: number } {
  if (!raw) return {};
  const security: SecuritySummary = {
    critical: raw.critical ?? 0,
    high: raw.high ?? 0,
    medium: raw.medium ?? 0,
    low: raw.low ?? 0,
    unknown: raw.unknown ?? 0,
  };
  return {
    security,
    securityTotal: security.critical + security.high + security.medium + security.low + security.unknown,
  };
}

// Lightweight: one search call -> map of package name -> basic facts (used by the index).
export async function fetchArtifactHub(): Promise<Record<string, AhFacts>> {
  const out: Record<string, AhFacts> = {};
  try {
    const res = await fetch(`${API}/packages/search?ts_query_web=quenchworks&kind=0&limit=60`, {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return out;
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
        ...parseSecurity(p.security_report_summary),
      };
    }
  } catch {
    /* fall back */
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
      security: sec,
      securityTotal: sec ? sec.critical + sec.high + sec.medium + sec.low + sec.unknown : undefined,
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
