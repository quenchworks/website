# Build stage: pnpm resolves, locks, and builds (dev deps included here).
FROM ghcr.io/quenchworks/images/pnpm:9.15.9 AS build
USER root
WORKDIR /app
ENV PNPM_HOME=/tmp/pnpm

COPY package.json pnpm-lock.yaml ./
RUN ["pnpm", "install", "--frozen-lockfile"]
COPY . .
RUN ["pnpm", "run", "build"]
# Re-resolve to production-only for the runtime stage.
RUN ["pnpm", "install", "--prod", "--frozen-lockfile"]

# Runtime stage: prod node_modules + built dist on a slim node base, nonroot.
FROM ghcr.io/quenchworks/images/node:26.4.0 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER 1001
EXPOSE 3000
CMD ["node", "dist/server.js"]