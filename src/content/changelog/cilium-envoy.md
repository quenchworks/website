---
title: "Cilium Envoy"
date: 2026-11-18
summary: "Cilium Envoy joined the catalog: the L7 proxy behind Cilium's HTTP, Kafka and DNS-aware network policy, built from the cilium/proxy source at the commit the cilium 1.20 chart pins, on Envoy 1.39.6 with Cilium's patches. The image carries cilium-envoy, cilium-envoy-starter and cilium-envoy-healthcheck, plus the inventory of the C and C++ libraries compiled into the static binary, which the build scans by CPE next to the usual image scan. The Rust DNS resolver crate moved to a fixed release on the way."
tags: [images]
issue: https://github.com/quenchworks/images/issues/111
---
