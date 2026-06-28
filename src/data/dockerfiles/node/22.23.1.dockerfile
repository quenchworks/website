# Base: a common starting point for the dependency and build stages.
FROM ghcr.io/quenchworks/images/node:22.23.1 AS base
WORKDIR /app
ENV PNPM_HOME=/tmp/pnpm \
    npm_config_cache=/tmp/npm

# prod-deps: resolve production dependencies only.
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN ["corepack", "enable"]
RUN ["pnpm", "install", "--prod", "--frozen-lockfile"]

# build: install the full dependency set and build.
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN ["corepack", "enable"]
RUN ["pnpm", "install", "--frozen-lockfile"]
COPY . .
RUN ["pnpm", "run", "build"]

# final: prod node_modules + built dist on a clean node base, nonroot.
FROM ghcr.io/quenchworks/images/node:22.23.1 AS final
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER 1001
EXPOSE 3000
CMD ["node", "dist/server.js"]