# Build stage: cache deps into a fixed DENO_DIR, then compile checks.
FROM ghcr.io/quenchworks/images/deno:2.9.3 AS build
USER root
WORKDIR /app
ENV DENO_DIR=/deno-dir

COPY deno.json deno.lock ./
RUN ["deno", "install", "--frozen"]
COPY . .
RUN ["deno", "cache", "main.ts"]

# Runtime stage: copy the cache + app onto a clean deno base, run nonroot.
FROM ghcr.io/quenchworks/images/deno:2.9.3 AS runtime
WORKDIR /app
ENV DENO_DIR=/tmp/deno
COPY --from=build /deno-dir /tmp/deno
COPY --from=build /app /app
USER 1001
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "--cached-only", "main.ts"]