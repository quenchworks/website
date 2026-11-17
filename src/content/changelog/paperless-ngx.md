---
title: "Paperless-ngx"
date: 2026-11-17
summary: "Paperless-ngx 3.5.0 joined the catalog with a signed chart: document management that scans, OCRs and indexes paper documents, on PostgreSQL and Valkey. The image builds the Django app and the Angular UI from source and leaves out the optional AI stack. Every Rust extension (the tantivy search index, pydantic-core, granian, rpds-py, watchfiles) is rebuilt so the scanner sees its crates, and those builds moved pyo3 and rustls to fixed releases. Building it also found that a fresh data volume lost every search index write, because Paperless fell back to an in-memory index when the index folder was missing; the image now creates it. The chart runs the web server, the Celery worker and scheduler and the consume-folder watcher in one pod, and generates the secret key and the admin password. Its install gate posts a PDF through the API and finds it by full-text search, again after a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/106
---
