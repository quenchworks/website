---
title: "Zalando Postgres Operator and Spilo"
date: 2026-11-19
summary: "The Zalando Postgres Operator joined the catalog with the database image its clusters run. Spilo 18.7 is PostgreSQL 18 with Patroni and WAL-G, built on Wolfi with Spilo's scripts at a pinned commit; bg_mon, pgextwlist, plpython3u and pgbouncer 1.26.1 are compiled from source (Wolfi's pgbouncer is stuck at 1.24.1 with a critical CVE), and pgvector and pg_cron are included. The operator 2.0.3 is a static Go binary built from source. The postgres-operator chart pins both by digest and always runs clusters on this Spilo; its install gate creates a postgresql resource and checks that it reaches Running with a Patroni leader on the Kubernetes API, that the requested role and database exist, and that PostgreSQL runs as uid 101. This first release carries PostgreSQL 18 only, without timescaledb."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/114
---
