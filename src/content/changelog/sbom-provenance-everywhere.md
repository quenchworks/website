---
title: Every image now ships an SBOM + SLSA provenance
date: 2026-06-13
summary: Alongside its cosign signature, every image now carries an SPDX SBOM and a SLSA build-provenance attestation on the same digest.
tags: ["security", "images", "supply-chain"]
---

Supply-chain metadata is now standard on the whole image catalog. Each image already shipped a keyless cosign signature; it now also carries an SPDX software bill of materials and a SLSA build-provenance statement, attached to the same digest as OCI referrers.

The SBOM lists every package in the image so you can audit and triage against the exact digest you run. The provenance binds that digest to the GitHub Actions workflow, commit, and runner that produced it. You can verify both yourself with `gh attestation verify`, with no key to manage on either side. See the SBOM and provenance docs for the exact commands.
