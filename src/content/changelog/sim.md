---
title: "Sim"
date: 2026-11-19
summary: "Sim joined the catalog as the self-hosted replacement for Flowise, which its maintainers archived on 2026-08-13. Sim is a visual builder for AI agent workflows. Three images build from the simstudioai/sim release source on Wolfi Bun: the Next.js app (with isolated-vm rebuilt against Wolfi Node.js 24, and no npm in the image), the realtime collaboration server, and the database migrations. They keep upstream's better-auth 1.6.27, because its fixed 1.7 line breaks the build; each of its advisories, the critical CVE-2026-114607 among them, needs a plugin or setting Sim does not use, and the published VEX gives the file and line for each. The sim chart runs the app with the migrations as an init container, the realtime server, one CronJob per schedule for scheduled workflows and webhook polling, and the bundled PostgreSQL with pgvector. Its install gate signs up, refuses a wrong password, signs in, checks the realtime handshake, runs the scheduled jobs once and keeps the session across a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/115
---
