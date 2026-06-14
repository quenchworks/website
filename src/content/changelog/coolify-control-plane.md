---
title: Coolify lands as a hardened control-plane wave
date: 2026-06-14
summary: The Coolify stack is now in the catalog as hardened, 0-CVE images and an umbrella chart you can deploy as one unit.
tags: ["images", "charts", "coolify"]
---

Coolify joins the catalog as a full control-plane wave. Four new images ship hardened and pinned by digest: coolify-app, coolify-realtime, coolify-helper, and a postgresql-15 backing store. On top of them sits the coolify umbrella chart, which wires the parts together with production defaults so you can bring up the whole control plane from a single release rather than stitching the services yourself.

Every image in the wave is built from source on Wolfi, scanned to zero fixable CVEs, cosign-signed, and carries an SPDX SBOM and a SLSA build-provenance attestation.
