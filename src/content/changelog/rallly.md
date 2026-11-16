---
title: "Rallly"
date: 2026-11-16
summary: "Rallly 4.17.0 joined the catalog with a signed chart: meeting scheduling polls, a self-hosted Doodle alternative, where people sign in with a code sent by email and participants vote without an account. The image builds the Next.js app from source and carries an exact Prisma CLI for migrations, where upstream installs whatever prisma 7 is newest at build time; its dependencies take overrides for @hono/node-server, deepmerge-ts, mysql2 and valibot. The chart runs on the bundled PostgreSQL and generates the session secret. Its install gate gets a sign-in code through the Mailpit chart, checks that a wrong code is refused, signs in, and keeps the session across a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/97
---
