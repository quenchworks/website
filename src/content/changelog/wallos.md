---
title: "Wallos"
date: 2026-11-16
summary: "Wallos 5.11.1 joined the catalog with a signed chart: a subscription and recurring-cost tracker with currencies, notifications, statistics and TOTP 2FA, on SQLite. The image runs php-fpm behind our nginx with upstream's schedule under supercronic, and backports the OTPHP 11.4.3 digits bound into its vendored copy. The chart registers the first account at install, so registration is never left open. Its install gate signs in, adds a subscription, reads it back after a pod restart and repeats over TLS."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/85
---
