// Per-image fixable/total history from the nightly scans' git history.
//
// security-scan commits src/data/security.json every night, so `git log` on that file is
// the time series. This takes the last commit of each day, reads every image's fixable
// and total counts, and keeps only the days a value changed (plus the first and the
// latest), so the file stays small. Run from the website repo root; it needs full
// history (the Cloudflare build may not have it), so the output is committed.
//
//   node scripts/gen-security-history.mjs  ->  src/data/security-history.json
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 256 << 20 });

const lastPerDay = new Map(); // date -> sha (git log is newest first, keep the first seen)
for (const line of git('log', '--format=%H %ad', '--date=short', '--', 'src/data/security.json').trim().split('\n')) {
  const [sha, date] = line.split(' ');
  if (!lastPerDay.has(date)) lastPerDay.set(date, sha);
}
const days = [...lastPerDay.keys()].sort();

const history = {}; // slug -> [[date, fixable, total], ...]
for (const date of days) {
  let snap;
  try {
    snap = JSON.parse(git('show', `${lastPerDay.get(date)}:src/data/security.json`));
  } catch {
    continue; // a malformed or missing snapshot is skipped, not guessed at
  }
  for (const [slug, rec] of Object.entries(snap)) {
    if (!rec || typeof rec !== 'object' || rec.fixable == null) continue;
    const point = [date, Number(rec.fixable) || 0, Number(rec.total) || 0];
    const series = (history[slug] ??= []);
    const prev = series.at(-1);
    if (!prev || prev[1] !== point[1] || prev[2] !== point[2]) series.push(point);
  }
}
const latest = days.at(-1);
for (const series of Object.values(history)) {
  const prev = series.at(-1);
  if (prev[0] !== latest) series.push([latest, prev[1], prev[2]]);
}

writeFileSync('src/data/security-history.json', JSON.stringify({ from: days[0], to: latest, images: history }) + '\n');
console.log(`security-history: ${Object.keys(history).length} images, ${days.length} days (${days[0]} .. ${latest})`);
