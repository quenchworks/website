---
title: "Ghostfolio"
date: 2026-11-17
summary: "Ghostfolio 3.100.0 joined the catalog with a signed chart: a wealth management and portfolio tracker for stocks, ETFs and crypto, on PostgreSQL and Valkey. The image builds the API and the Angular client from source, but ships only the dependencies the API actually imports, where upstream's image carries the whole build toolchain; the rest of the fixes come from overrides. One finding has no fix: node-forge's RSA signature flaw, which no code path reaches, so it is covered by a VEX statement that cites the exact lines. The chart generates the token salt and JWT key and bundles a password-protected Valkey. Its install gate checks health, that the first account becomes the admin, that its token logs in while a wrong one is refused, and that the account survives a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/105
---
