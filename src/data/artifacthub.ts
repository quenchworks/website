// Build-time enrichment from the ArtifactHub API. ArtifactHub sends no CORS headers,
// so this runs server-side during `astro build` only -- never in the browser.
// If AH is unreachable, callers fall back to the static catalog values, so a deploy
// never fails because of a third-party outage.

export interface AhFacts {
  version: string;
  appVersion?: string;
  signed: boolean;
  signatures: string[];
  repo: string; // ArtifactHub repository name, e.g. quench-redis
  url: string; // ArtifactHub package page
  ts?: number; // last published (unix seconds)
}

// package name (== our slug) -> live facts
export async function fetchArtifactHub(): Promise<Record<string, AhFacts>> {
  const out: Record<string, AhFacts> = {};
  try {
    const res = await fetch(
      'https://artifacthub.io/api/v1/packages/search?ts_query_web=quenchworks&kind=0&limit=60',
      { headers: { accept: 'application/json' } },
    );
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
        url: `https://artifacthub.io/packages/helm/${repo}/${p.name}`,
        ts: p.ts,
      };
    }
  } catch {
    // network/parse failure: return what we have (possibly empty) and let callers fall back
  }
  return out;
}
