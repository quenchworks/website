# Build stage: compile a static (musl) release binary.
FROM ghcr.io/quenchworks/images/rust:1.96.1 AS build
USER root
WORKDIR /src
ENV CARGO_HOME=/tmp/cargo

RUN ["rustup", "target", "add", "x86_64-unknown-linux-musl"]
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN ["cargo", "build", "--release", "--target", "x86_64-unknown-linux-musl"]

# Runtime stage: just the binary on the tiny static base, nonroot.
FROM ghcr.io/quenchworks/images/static
COPY --from=build /src/target/x86_64-unknown-linux-musl/release/app /app
USER 1001
EXPOSE 8080
ENTRYPOINT ["/app"]