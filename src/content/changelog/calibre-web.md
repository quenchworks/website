---
title: "Calibre-Web"
date: 2026-11-17
summary: "Calibre-Web 0.6.27 joined the catalog with a signed chart: browse, read and download an ebook library kept in a Calibre database, with users, shelves and an OPDS feed. The image runs the app from source in a Python venv over Wolfi's native packages, and lifts the upstream version caps that held pypdf, cryptography, tornado, certifi and regex below their fixes (pypdf stays on 6.x). Upstream creates admin with the password admin123; the chart's init container sets the password from a generated Secret before every start. Its install gate signs in through the login form, checks that admin123 and a wrong password are refused, and keeps the account across a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/104
---
