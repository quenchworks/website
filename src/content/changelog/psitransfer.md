---
title: "PsiTransfer"
date: 2026-11-16
summary: "PsiTransfer 2.4.6 joined the catalog with a signed chart: simple file sharing with resumable uploads, expiring links, password-protected buckets and an admin page, no database. The image builds the client and the Node server from source with minimatch raised to its fixed release, and stamps the real version into package.json, which upstream leaves at 0.0.0. The chart generates the upload and admin passwords and serves HTTPS through PsiTransfer's own listener. Its install gate uploads a file over tus, downloads it back, checks both passwords, and repeats after a restart and over TLS."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/95
---
