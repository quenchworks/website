# Build stage: Composer installs and locks prod dependencies.
FROM ghcr.io/quenchworks/images/composer:2.10.0 AS build
USER root
WORKDIR /app
ENV COMPOSER_CACHE_DIR=/tmp/composer

COPY composer.json composer.lock ./
RUN ["composer", "install", "--no-dev", "--no-scripts", "--prefer-dist", "--no-progress"]
COPY . .
RUN ["composer", "dump-autoload", "--optimize", "--no-dev"]

# Runtime stage: vendor + app on a slim php base, nonroot.
FROM ghcr.io/quenchworks/images/php:8.5.7 AS runtime
WORKDIR /app
COPY --from=build /app /app
USER 1001
EXPOSE 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]