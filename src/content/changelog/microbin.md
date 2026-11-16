---
title: "MicroBin"
date: 2026-11-16
summary: "MicroBin 2.1.0 joined the catalog with a signed chart: a small pastebin and file-sharing server with private, read-only and encrypted uploads, expiry and an admin page, on SQLite. Built from source against Wolfi's OpenSSL with its dependencies refreshed; telemetry and update checks are off. The chart generates the admin password in place of upstream's default, and its install gate uploads a paste, reads it back and checks the admin login across a pod restart."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/68
---
