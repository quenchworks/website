---
title: "Grav"
date: 2026-11-16
summary: "Grav 2.2.29 joined the catalog with a signed chart: a flat-file CMS with a web admin, Markdown pages, themes and plugins, no database. The image runs the grav-admin release with upstream's nginx deny rules; plugins and themes ship in the image and the site content lives on a volume. Its install gate checks the site renders, user config is not served, a wrong password is refused and the admin's API token reads the pages, before and after a pod restart and over TLS."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/81
---
