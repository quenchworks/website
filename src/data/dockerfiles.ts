// Thin loader for the best-practice, runtime-specific Dockerfiles shown on the
// /images/<slug> detail pages. The Dockerfile bodies live as real, lintable,
// syntax-highlightable files under ./dockerfiles/<slug>.dockerfile; this module
// only pairs each one with a one-line note and exposes a lookup.

/** One version variant of a runtime's best-practice Dockerfile. */
export interface DockerfileVariant {
  /** The version tag this Dockerfile is pinned to (e.g. "3.14"). */
  version: string;
  /** The complete Dockerfile, rendered with Expressive Code as a `dockerfile` block. */
  code: string;
}

export interface DockerfileEntry {
  /** One-line explanation of the approach for this runtime, shown above the block. */
  note: string;
  /** One Dockerfile per supported version tag, newest first (first = default tab). */
  variants: DockerfileVariant[];
}

// Per-slug prose. This is real explanation, not code, so it stays in TS.
const NOTES: Record<string, string> = {
  python:
    'Build a self-contained virtualenv with the full build toolchain in the first stage, then copy just that venv onto a clean python base for the runtime. Compilers and headers never reach the deployed image.',
  ruby: 'Install gems with Bundler in deployment mode in the build stage, then copy the vendored bundle and app onto a clean ruby base. Native gem build tooling stays behind.',
  php: 'Resolve dependencies with Composer in the build stage, then copy the vendor tree and app onto a clean php base. Composer itself never ships in the runtime image.',
  perl: 'Install CPAN dependencies into a local lib with cpanm in the build stage, then copy that tree and the app onto a clean perl base.',
  bun: "Install dependencies with Bun's frozen lockfile in the build stage, build there, then copy the prod node_modules and built output onto a clean bun base.",
  deno: 'Cache dependencies into a vendored, read-only-friendly cache in the build stage, then copy that cache and the app onto a clean deno base. The runtime DENO_DIR lives under /tmp.',
  elixir:
    'Build a self-contained OTP release with mix in the build stage, then copy that release onto a clean elixir base. The release bundles the BEAM and your compiled app; only prod deps are included.',
  erlang:
    'Assemble a self-contained rebar3 release on the BEAM in the build stage, then copy that release onto a clean erlang base. The release carries the runtime system and only prod deps.',
  node: 'The four-stage pnpm pattern: a shared base, a prod-only dependency stage, a build stage with the full dependency set, and a slim final stage that ships only the production node_modules and the built dist.',
  go: 'The classic two-stage Go build: compile a fully static binary with CGO disabled on the go image, then copy that one file onto the tiny static base. No toolchain, no shell, no package manager in the final image.',
  rust: 'Compile a release binary against the musl target on the rust image so it links statically, then copy it onto the tiny static base. The Cargo home points at /tmp for the read-only root filesystem.',
  jdk: 'Compile and package the jar with the full JDK in the build stage, then run it on the slim jre base. The compiler and build outputs stay behind; only the jar ships.',
  maven:
    'Resolve dependencies and package the jar with the maven image (local repository cached under /tmp/.m2), then run it on the slim jre base. The build tool and the dependency cache never ship.',
  gradle:
    'Build the jar with the gradle image (Gradle user home under /tmp for the read-only rootfs), then run it on the slim jre base. The daemon is disabled so the build is reproducible.',
  dotnet:
    'Restore and dotnet publish in Release with the full SDK, then run the published output on the aspnet base for web apps. The SDK and the NuGet cache stay in the build stage.',
  pnpm: 'pnpm leads: enabled here through corepack on the pnpm base, it resolves and locks the dependency set, builds, then a clean node base receives only the production node_modules and the built output.',
  yarn: 'Yarn Classic leads: preinstalled on the yarn base, it installs the production-only dependency set and builds, then a clean node base receives only the prod node_modules and the built output.',
  composer:
    'Composer leads: it installs and locks the production dependency set in the build stage, then a clean php base receives the vendor tree and the app. Composer itself never ships.',
  uv: 'uv leads: it resolves and syncs the locked, production-only dependency set into a venv, then a clean python base receives that venv and the app. uv never ships in the runtime image.',
  poetry:
    'Poetry leads: it installs the locked, production-only dependency set into an in-project venv, then a clean python base receives that venv and the app. Poetry never ships in the runtime image.',
  static:
    'static is a runtime base you copy a built artifact onto, not something you install into. Here a Go binary is compiled in a build stage and the static image is the final stage that carries it. A Rust musl binary lands the same way.',
  jre: 'jre is a runtime base you copy a built jar onto, not something you compile in. Here the jar is packaged with the matching JDK in the build stage and the jre image is the final stage that runs it.',
  aspnet:
    'aspnet is a runtime base you copy a published web app onto, not something you build in. Here dotnet publish runs in an SDK build stage and the aspnet image is the final stage that serves it.',
  'dotnet-runtime':
    'dotnet-runtime is a runtime base you copy a published console or worker app onto, not something you build in. Here dotnet publish runs in an SDK build stage and the dotnet-runtime image is the final stage that runs it.',
};

// Eagerly load every Dockerfile body as raw text, keyed by slug (basename).
// Eagerly load every real per-version Dockerfile body as raw text. The layout is
// ./dockerfiles/<slug>/<version>.dockerfile — one directory per runtime, one
// file per supported version with the version baked in literally (no templating).
const rawBodies = import.meta.glob('./dockerfiles/**/*.dockerfile', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// slug -> (version -> code). Parsed straight from the path: the parent directory
// is the slug, the basename (minus .dockerfile) is the version tag.
const bodies: Record<string, Record<string, string>> = {};
for (const [path, code] of Object.entries(rawBodies)) {
  const parts = path.split('/');
  const version = parts[parts.length - 1].replace(/\.dockerfile$/, '');
  const slug = parts[parts.length - 2];
  if (!slug || !version) continue;
  (bodies[slug] ??= {})[version] = code;
}

// Version-aware DESCENDING compare: split each version on '.', compare segment
// by segment numerically (so 3.14 > 3.9 > 3.13... no: 3.14 > 3.13 > 3.9). A
// non-numeric segment (e.g. "latest") has no numeric value and sorts last.
function compareVersionsDesc(a: string, b: string): number {
  const pa = a.split('.');
  const pb = b.split('.');
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const sa = pa[i];
    const sb = pb[i];
    const na = sa === undefined ? -Infinity : Number(sa);
    const nb = sb === undefined ? -Infinity : Number(sb);
    const aNum = Number.isNaN(na) ? null : na;
    const bNum = Number.isNaN(nb) ? null : nb;
    // Non-numeric (e.g. "latest") sorts last among siblings.
    if (aNum === null && bNum === null) {
      if (sa === sb) continue;
      return sa < sb ? 1 : -1;
    }
    if (aNum === null) return 1; // a is non-numeric → after b
    if (bNum === null) return -1; // b is non-numeric → after a
    if (aNum !== bNum) return bNum - aNum; // larger number first (descending)
  }
  return 0;
}

/**
 * The best-practice Dockerfile(s) for a runtime slug, or null if none is defined.
 *
 * File-driven: the variants are exactly the per-version files on disk under
 * ./dockerfiles/<slug>/, newest first. The files are generated (one per canonical
 * published version, with full-version FROM tags) by scripts/gen-dockerfiles.mjs,
 * so the tabs match the version pages and every FROM tag resolves to a real image.
 */
export function dockerfileFor(slug: string): DockerfileEntry | null {
  const files = bodies[slug];
  const note = NOTES[slug];
  if (!files || !note) return null;

  const versions = Object.keys(files).sort(compareVersionsDesc);
  if (versions.length === 0) return null;

  const variants = versions.map((version) => ({ version, code: files[version] }));
  return { note, variants };
}
