---
title: Harbor 2.14.4 ships
date: 2026-06-09
summary: A multi-image registry wave brings Harbor 2.14.4 to the catalog, with an umbrella chart that stands up the full registry.
tags: ["images", "charts", "harbor"]
---

Harbor 2.14.4 is now in the catalog. The release lands as a multi-image wave covering the registry components, each built from source on Wolfi, scanned to zero fixable CVEs, and pinned by digest. An umbrella chart ties the components into a single release so you can stand up a complete registry without wiring the services together yourself.

The core image carries a patch for trusted CSRF origins so the UI login works behind an external endpoint; set the access host to match your configured external endpoint.
