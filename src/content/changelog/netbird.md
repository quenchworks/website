---
title: "NetBird"
date: 2026-11-17
summary: "NetBird 0.83.1 joined the catalog with a signed chart: a WireGuard mesh VPN with single sign-on, access policies and routing peers. All nine images upstream publishes are built from source (the client, management, signal, relay, the combined server, reverse proxy, upload server and nblink), plus the dashboard (Next.js, served by nginx from a read-only root filesystem). One dependency could not move to its fixed release: every fixed pion/stun version requires a transport library NetBird's client cannot take yet, so the two-line upstream fix is applied to a vendored copy and documented in a VEX statement. The chart runs management with NetBird's built-in sign-in (no external identity provider needed), signal, relay and the dashboard on PostgreSQL behind one host, with optional routing peers. Its install gate checks the sign-in issuer, that the API refuses anonymous calls, that the first administrator exists, the dashboard settings and the relay, again after a restart and an upgrade."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/108
---
