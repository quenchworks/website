---
title: Per-image, per-version security grades from a nightly scan
date: 2026-06-29
summary: A nightly Trivy scan now grades every image and every version (A+ to F) with a full CVE severity breakdown and a fixable count, shown on the cards and detail pages and served from the API, with no dependency on ArtifactHub.
tags: ["security", "images", "charts", "api"]
---

Every published image now carries its own security grade from a nightly Trivy scan that runs straight against the GHCR image digests, with no dependency on ArtifactHub. Each image, and each of its version lines, is graded from A+ (no CVEs) down to F, with a 0 to 100 score, a full critical/high/medium/low/unknown breakdown, and a count of how many findings are fixable (the ones a rebuild clears).

The grade appears on every catalog card and on the image, chart, and runtime detail pages, and it follows the version you select, so the report always matches the exact tag you are viewing. A clean image reads A+; an image that is a rebuild behind shows the grade, the affected severities, and how many CVEs a rebuild would clear.

The same data is published through the API: `/api/v1/security.json` gives the catalog total, a severity rollup, the number of images needing a rebuild, and a per-image record, and every images and charts item now carries its own `security` object. The scan refreshes daily and the numbers are never hardcoded.
