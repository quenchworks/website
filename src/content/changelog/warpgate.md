---
title: "Warpgate"
date: 2026-11-18
summary: "Warpgate 0.30.4 joined the catalog with a signed chart: a bastion (jump host) for SSH, HTTPS, MySQL and PostgreSQL targets with single sign-on, per-target access and session recording, and no client agent, so people keep using their usual tools. The image builds from source: the Rust server through cargo auditable, so every crate stays visible to the scanner, and the web UI with Node. The SSH library moved to a fixed release. The chart runs it with its data on a volume and a generated admin password set up on the first start. Its install gate signs in to the web API, checks that a wrong password is refused and that the SSH port answers, again after a restart and an upgrade. It is also part of the VPN stack, next to NetBird."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/109
---
