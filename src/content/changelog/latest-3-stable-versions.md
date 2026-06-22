---
title: Latest three stable versions, every chart repinned
date: 2026-06-22
summary: Each image now ships its latest three stable release lines, and every chart was repinned to the freshly scanned, signed digest and re-released.
tags: ["images", "charts", "versions"]
---

Every image in the catalog now publishes its latest three stable release lines as full X.Y.Z tags, each built from source, scanned to zero fixable CVEs, signed, and pinned by digest. The per-version detail pages list them with size, publish date, and digest, and a version switcher hops between them.

On the chart side, every chart was repinned to the freshly built and scanned image digest and re-released as a signed OCI chart, so a fresh install always deploys the current, attested image. CoreDNS and Distribution also joined the catalog, each as a hardened image plus chart.
