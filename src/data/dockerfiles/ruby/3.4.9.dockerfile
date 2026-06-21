# Build stage: install gems in deployment mode (build deps included).
FROM ghcr.io/quenchworks/images/ruby:3.4.9 AS build
USER root
WORKDIR /app
ENV BUNDLE_PATH=/app/vendor/bundle \
    BUNDLE_DEPLOYMENT=true \
    BUNDLE_WITHOUT=development:test

COPY Gemfile Gemfile.lock ./
RUN ["bundle", "install"]
COPY . .

# Runtime stage: copy the vendored bundle + app onto a clean ruby base.
FROM ghcr.io/quenchworks/images/ruby:3.4.9 AS runtime
WORKDIR /app
ENV BUNDLE_PATH=/app/vendor/bundle \
    BUNDLE_DEPLOYMENT=true \
    BUNDLE_WITHOUT=development:test \
    GEM_HOME=/tmp/gem
COPY --from=build /app /app
USER 1001
EXPOSE 3000
CMD ["bundle", "exec", "ruby", "app.rb"]