---
title: "Trilium Notes"
date: 2026-11-16
summary: "Trilium Notes 0.107.0 joined the catalog with a signed chart: hierarchical note-taking with rich text, code notes, scripting, an HTTP API and sync for the desktop app, from the TriliumNext project. The image builds the server and its web client from source, with hono, @hono/node-server, minimatch, qs, undici and uuid raised to fixed releases inside the bundle and better-sqlite3 compiled for the image. Upstream asks the first visitor to create the document and set the password; the chart's post-install Job does both, with the password from a generated Secret. Its install gate signs in over the API, creates a note and reads it back, checks the document holds nothing else, and keeps the note across a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/100
---
