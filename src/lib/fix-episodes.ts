// Time to fix, from src/data/security-history.json. An episode opens at the first nightly scan
// with fixable findings for an image and closes at the next scan with none; an episode still
// open at the last scan is not counted, so the figures describe fixes that actually landed.
export type Point = [string, number, number]; // [date, fixable, total]

const day = (d: string) => Date.parse(d + 'T00:00:00Z') / 86400000;

export function fixDays(series: Point[]): number[] {
  const out: number[] = [];
  let opened: string | null = null;
  for (const [d, f] of series) {
    if (f > 0 && opened === null) opened = d;
    else if (f === 0 && opened !== null) {
      out.push(day(d) - day(opened));
      opened = null;
    }
  }
  return out;
}

export function quantile(sorted: number[], q: number): number | null {
  if (sorted.length === 0) return null;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i), hi = Math.ceil(i);
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo));
}

// Catalog-wide: every closed episode across every image.
export function catalogFixStats(images: Record<string, Point[]>) {
  const all = Object.values(images).flatMap(fixDays).sort((a, b) => a - b);
  return { episodes: all.length, median: quantile(all, 0.5), p90: quantile(all, 0.9) };
}
