---
title: "RSS-Bridge"
date: 2026-11-16
summary: "RSS-Bridge 2025-08-05 joined the catalog with a signed chart: Atom, JSON and other feeds for sites that have none, with 400+ bridges. The image runs php-fpm behind our nginx and executes index.php only; settings come from RSSBRIDGE_* variables. The chart turns basic auth on by default, takes a list of enabled bridges and keeps a per-pod cache. Its install gate checks auth, renders the demo bridge as Atom and JSON, checks the bridge list limit and that code files are not served, and repeats over TLS."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/87
---
