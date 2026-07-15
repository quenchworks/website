# Build stage: Yarn (Classic) installs the full set and builds.
FROM ghcr.io/quenchworks/images/yarn:3.8.7 AS build
USER root
WORKDIR /app
ENV YARN_CACHE_FOLDER=/tmp/yarn

COPY package.json yarn.lock ./
RUN ["yarn", "install", "--frozen-lockfile"]
COPY . .
RUN ["yarn", "build"]

# Prod-deps stage: a clean install of production dependencies only.
FROM ghcr.io/quenchworks/images/yarn:3.8.7 AS prod-deps
USER root
WORKDIR /app
ENV YARN_CACHE_FOLDER=/tmp/yarn
COPY package.json yarn.lock ./
RUN ["yarn", "install", "--frozen-lockfile", "--production"]

# Runtime stage: prod node_modules + built dist on a slim node base, nonroot.
FROM ghcr.io/quenchworks/images/node:26.5.0 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER 1001
EXPOSE 3000
CMD ["node", "dist/server.js"]
