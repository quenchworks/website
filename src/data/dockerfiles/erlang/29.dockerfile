# Build stage: fetch deps and assemble a prod rebar3 release.
FROM ghcr.io/quenchworks/images/erlang:29 AS build
USER root
WORKDIR /app
ENV REBAR_CACHE_DIR=/tmp/rebar3

COPY rebar.config rebar.lock ./
RUN ["rebar3", "get-deps"]
COPY . .
RUN ["rebar3", "as", "prod", "release"]

# Runtime stage: copy the self-contained release onto a clean erlang base.
FROM ghcr.io/quenchworks/images/erlang:29 AS runtime
WORKDIR /app
ENV HOME=/tmp
COPY --from=build /app/_build/prod/rel/app ./
USER 1001
EXPOSE 8080
CMD ["bin/app", "foreground"]