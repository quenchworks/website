---
title: "Chhoto URL"
date: 2026-11-16
summary: "Chhoto URL 7.11.4 joined the catalog with a signed chart: a small self-hosted URL shortener with a web UI, API keys, expiring links, hit counts and OIDC login, on SQLite. The image is built from source with cargo auditable. The chart generates the web UI password and a 64-byte API key, keeps them on upgrade and offers an Ingress for TLS, since the app has no TLS listener. Its install gate adds a link with the generated key, follows the redirect, refuses a wrong key and password, and keeps the link across a pod restart."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/88
---
