---
title: "Envoy built from source"
date: 2026-11-17
summary: "Envoy now builds from source with Bazel instead of from Wolfi's package. Public Wolfi stopped publishing Envoy at 1.38.1, which carried a CRITICAL brotli finding whose fix exists only in non-public revisions. Envoy 1.40.2 replaces it in the envoy, contour and envoy-gateway charts. A static Envoy hides its C and Rust libraries from image scanners, so the image ships an inventory of everything compiled in (the linked Bazel modules with their versions and CPE identifiers, and the Rust Cargo.lock), and the build is gated twice: by Trivy and by a CPE scan of that inventory. That scan found and fixed c-ares and rustls; three findings that do not apply to this build (fixes already in the pinned commits, server code not linked) are covered by VEX statements with the evidence."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/107
---
