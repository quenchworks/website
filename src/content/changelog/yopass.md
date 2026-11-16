---
title: "Yopass"
date: 2026-11-16
summary: "Yopass 16.1.0, 16.0.1 and 15.1.0 joined the catalog with a signed chart: share passwords and other secrets through one-time links. The browser encrypts each secret with OpenPGP and the server keeps only ciphertext in Memcached or Redis. The image holds the server, the yopass CLI and the web UI, all built from source; the chart bundles our memcached. Its install gate stores a gpg-encrypted secret, reads it once after a server pod restart, refuses plain text and reusable secrets, and repeats the round trip over TLS."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/83
---
