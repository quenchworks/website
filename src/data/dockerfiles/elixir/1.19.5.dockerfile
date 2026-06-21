# Build stage: fetch deps and assemble a prod mix release.
FROM ghcr.io/quenchworks/images/elixir:1.19.5 AS build
USER root
WORKDIR /app
ENV MIX_ENV=prod \
    MIX_HOME=/tmp/mix \
    HEX_HOME=/tmp/hex

RUN ["mix", "local.hex", "--force"]
RUN ["mix", "local.rebar", "--force"]
COPY mix.exs mix.lock ./
RUN ["mix", "deps.get", "--only", "prod"]
RUN ["mix", "deps.compile"]
COPY . .
RUN ["mix", "release"]

# Runtime stage: copy the self-contained release onto a clean elixir base.
FROM ghcr.io/quenchworks/images/elixir:1.19.5 AS runtime
WORKDIR /app
ENV HOME=/tmp
COPY --from=build /app/_build/prod/rel/app ./
USER 1001
EXPOSE 4000
CMD ["bin/app", "start"]