---
title: "Wiki.js"
date: 2026-11-17
summary: "Wiki.js 3.4.0 joined the catalog with a signed chart: a wiki with Markdown and visual editors, Git sync and many sign-in providers, on PostgreSQL. The image builds the frontend, the content blocks and the backend from source on Node 26, with fast-uri, fast-xml-parser, undici and yaml raised to fixed releases, and preloads the Temporal polyfill upstream's frontend uses, because Wolfi's Node 26 is built without it. The optional Puppeteer extension is left out: it downloads its own Chrome. The chart sets the first administrator from a generated password, where upstream would create admin@example.com with the password 12345678. Its install gate signs in through the API, checks that 12345678 and a wrong password are refused, and keeps the account across a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/22
---
