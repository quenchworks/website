---
title: Harbor observability bundle
date: 2026-06-11
summary: A meta-chart pairs Prometheus and Grafana with a ready-made Harbor dashboard so a fresh registry comes up already instrumented.
tags: ["charts", "observability", "harbor"]
---

Watching a Harbor registry no longer means assembling the monitoring stack by hand. The new observability meta-chart deploys Prometheus and Grafana together and ships a Harbor dashboard preloaded into Grafana, so a fresh registry comes up already instrumented for request rates, storage, and replication health.

Both backing images are the hardened, 0-CVE builds from the catalog, pinned by digest. The Grafana build is the OSS (AGPL) v13.0.2 release on port 3000.
