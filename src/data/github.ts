// Build-time GitHub social proof. Sums stars across the QuenchWorks org's public
// repos via the GitHub REST API, fetched once during `astro build` (never in the
// browser). It MUST fail gracefully: any error, rate-limit, or non-200 response
// resolves to `null` so an offline or throttled build still succeeds. Callers
// render the count only when it is non-null.

const ORG = 'quenchworks';
const API = `https://api.github.com/orgs/${ORG}/repos?per_page=100&type=public`;

async function fetchOrgStars(): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
      'user-agent': 'quenchworks-website-build',
    };
    // Optional token lifts the unauthenticated rate limit on busy CI; absence is fine.
    const token = import.meta.env.GITHUB_TOKEN;
    if (token) headers.authorization = `Bearer ${token}`;

    const res = await fetch(API, { headers });
    if (!res.ok) return null;

    const repos = (await res.json()) as Array<{ stargazers_count?: number }>;
    if (!Array.isArray(repos)) return null;

    const total = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
    return Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

/** Total GitHub stars across the QuenchWorks org, or null if unavailable. */
export const githubStars: number | null = await fetchOrgStars();
