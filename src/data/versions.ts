// Version-aware DESCENDING compare for image tags / version strings. Splits each
// version on '.', compares segment by segment numerically (so 3.14 > 3.13 > 3.9).
// A non-numeric segment (e.g. "latest") sorts last among siblings. Lives in its
// own module so route getStaticPaths functions (which Astro extracts into an
// isolated scope) can import it instead of relying on top-level hoisting.
export function compareVersionsDesc(a: string, b: string): number {
  const pa = a.split('.');
  const pb = b.split('.');
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] === undefined ? -Infinity : Number(pa[i]);
    const nb = pb[i] === undefined ? -Infinity : Number(pb[i]);
    const aNum = Number.isNaN(na) ? null : na;
    const bNum = Number.isNaN(nb) ? null : nb;
    if (aNum === null && bNum === null) {
      if (pa[i] === pb[i]) continue;
      return pa[i] < pb[i] ? 1 : -1;
    }
    if (aNum === null) return 1;
    if (bNum === null) return -1;
    if (aNum !== bNum) return bNum - aNum;
  }
  return 0;
}
