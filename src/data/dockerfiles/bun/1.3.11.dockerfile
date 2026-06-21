# Build stage: install all deps (frozen) and build with Bun.
FROM ghcr.io/quenchworks/images/bun:1.3.11 AS build
USER root
WORKDIR /app
ENV BUN_INSTALL_CACHE_DIR=/tmp/bun

COPY package.json bun.lock ./
RUN ["bun", "install", "--frozen-lockfile"]
COPY . .
RUN ["bun", "run", "build"]
# Prune to production dependencies for the runtime stage.
RUN ["bun", "install", "--frozen-lockfile", "--production"]

# Runtime stage: prod deps + built output on a clean bun base, nonroot.
FROM ghcr.io/quenchworks/images/bun:1.3.11 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER 1001
EXPOSE 3000
CMD ["bun", "run", "dist/server.js"]