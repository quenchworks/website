# Build stage: uv resolves and installs into a project venv, fast.
FROM ghcr.io/quenchworks/images/uv:0.11.24 AS build
USER root
WORKDIR /app
ENV UV_PROJECT_ENVIRONMENT=/opt/venv \
    UV_COMPILE_BYTECODE=1 \
    UV_CACHE_DIR=/tmp/uv

COPY pyproject.toml uv.lock ./
RUN ["uv", "sync", "--frozen", "--no-install-project", "--no-dev"]
COPY . .
RUN ["uv", "sync", "--frozen", "--no-dev"]

# Runtime stage: copy the venv + app onto a clean python base, nonroot.
FROM ghcr.io/quenchworks/images/python:3.14.6 AS runtime
WORKDIR /app
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1
COPY --from=build /opt/venv /opt/venv
COPY --from=build /app /app
USER 1001
EXPOSE 8000
CMD ["python", "-m", "app"]