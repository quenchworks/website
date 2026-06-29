# Build stage: compile a fully static binary.
FROM ghcr.io/quenchworks/images/go:1.25.0 AS build
USER root
WORKDIR /src
# CGO off makes the binary static; caches go to /tmp for the read-only rootfs.
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOCACHE=/tmp/gocache \
    GOMODCACHE=/tmp/gomodcache

COPY go.mod go.sum ./
RUN ["go", "mod", "download"]
COPY . .
RUN ["go", "build", "-trimpath", "-ldflags=-s -w", "-o", "/out/app", "./cmd/app"]

# Runtime stage: just the binary on the tiny static base, nonroot.
FROM ghcr.io/quenchworks/images/static
COPY --from=build /out/app /app
USER 1001
EXPOSE 8080
ENTRYPOINT ["/app"]