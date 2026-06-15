# Build stage: install everything into a venv (build deps included).
FROM ghcr.io/quenchworks/images/python:3.14 AS build
USER root
WORKDIR /app
ENV VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:$PATH" \
    PIP_CACHE_DIR=/tmp/pip

RUN ["python", "-m", "venv", "/opt/venv"]
COPY requirements.txt ./
RUN ["pip", "install", "--no-cache-dir", "-r", "requirements.txt"]
COPY . .

# Runtime stage: copy the venv + app onto a clean python base, run nonroot.
FROM ghcr.io/quenchworks/images/python:3.14 AS runtime
WORKDIR /app
ENV VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    XDG_CACHE_HOME=/tmp
COPY --from=build /opt/venv /opt/venv
COPY --from=build /app /app
USER 1001
EXPOSE 8000
CMD ["python", "-m", "app"]