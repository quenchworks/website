// check-dist-files.mjs — fail the build when dist nears Cloudflare Pages' 20,000-file
// cap. Past the cap a deploy fails silently and the live site stays on the old build.
// Runs last in `pnpm build`, after Pagefind has written its fragments.
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIMIT = 19000;
const dist = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');
const count = readdirSync(dist, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).length;

if (count > LIMIT) {
  console.error(
    `check-dist-files: dist has ${count} files, over the ${LIMIT} guard (Cloudflare Pages fails silently past 20,000). ` +
      'Find what grew (per-version pages x 3 locales, Pagefind fragments) and cut it before deploying.',
  );
  process.exit(1);
}
console.log(`check-dist-files: ${count} files (guard ${LIMIT}, Cloudflare cap 20,000).`);
