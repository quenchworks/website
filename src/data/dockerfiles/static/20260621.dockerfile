# Build stage: compile a fully static binary (Go shown; Rust musl is the same idea).
FROM ghcr.io/quenchworks/images/go:1.26.5 AS build
USER root
WORKDIR /src
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOCACHE=/tmp/gocache \
    GOMODCACHE=/tmp/gomodcache

COPY go.mod go.sum ./
RUN ["go", "mod", "download"]
COPY . .
RUN ["go", "build", "-trimpath", "-ldflags=-s -w", "-o", "/out/app", "./cmd/app"]

# This image is the final runtime stage: just the binary, nonroot.
FROM ghcr.io/quenchworks/images/static
COPY --from=build /out/app /app
USER 1001
EXPOSE 8080
ENTRYPOINT ["/app"]