# Build stage: Poetry installs the main group into an in-project venv.
FROM ghcr.io/quenchworks/images/poetry:2.3.4 AS build
USER root
WORKDIR /app
ENV POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    POETRY_CACHE_DIR=/tmp/poetry

COPY pyproject.toml poetry.lock ./
RUN ["poetry", "install", "--only", "main", "--no-root"]
COPY . .
RUN ["poetry", "install", "--only", "main"]

# Runtime stage: copy the venv + app onto a clean python base, nonroot.
FROM ghcr.io/quenchworks/images/python:3.14.6 AS runtime
WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1
COPY --from=build /app/.venv /app/.venv
COPY --from=build /app /app
USER 1001
EXPOSE 8000
CMD ["python", "-m", "app"]