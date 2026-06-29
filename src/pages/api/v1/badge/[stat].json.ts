// GET /api/v1/badge/{images,charts,cves}.json -> shields.io "endpoint" badges.
// Embed in any README, live (shields fetches this on render; refreshes each deploy):
//   ![images](https://img.shields.io/endpoint?url=https://quench-works.com/api/v1/badge/images.json)
//   ![charts](https://img.shields.io/endpoint?url=https://quench-works.com/api/v1/badge/charts.json)
//   ![CVEs](https://img.shields.io/endpoint?url=https://quench-works.com/api/v1/badge/cves.json)
import type { APIRoute } from 'astro';
import { availableCount } from '../../../../data/images';
import { chartCount } from '../../../../data/charts';
import security from '../../../../data/security.json';

const cveTotal = Object.values(security as Record<string, { total: number }>).reduce((a, r) => a + r.total, 0);

// style/namedLogo/logoColor live in the endpoint JSON so every embed renders
// for-the-badge + logo without per-README query params.
const COMMON = { style: 'for-the-badge', logoColor: 'white', labelColor: '1a1a1a' };
const STATS: Record<string, { label: string; message: string; color: string; namedLogo: string }> = {
  images: { label: 'hardened images', message: String(availableCount), color: 'blue', namedLogo: 'docker' },
  charts: { label: 'signed charts', message: String(chartCount), color: 'blue', namedLogo: 'helm' },
  cves: { label: 'open CVEs', message: String(cveTotal), color: cveTotal === 0 ? 'brightgreen' : 'orange', namedLogo: 'trivy' },
};

export const getStaticPaths = () => Object.keys(STATS).map((stat) => ({ params: { stat } }));

export const GET: APIRoute = ({ params }) => {
  const s = STATS[params.stat as string] ?? { label: 'quenchworks', message: 'n/a', color: 'lightgrey', namedLogo: 'shield' };
  return new Response(JSON.stringify({ schemaVersion: 1, ...COMMON, ...s }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
};
