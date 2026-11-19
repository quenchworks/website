---
title: "GitLab CE 19.6"
date: 2026-11-19
summary: "GitLab CE joins the catalog as four images and one chart: gitlab-rails (Puma, Sidekiq and the migration tasks in one image), gitlab-workhorse, gitaly and gitlab-shell, all built from the MIT gitlab-foss source on Wolfi. Every native gem in gitlab-rails is compiled against Wolfi's libraries, and the frontend is compiled at build time. Twelve gems move to fixed releases; the devise 5.0 security fixes are backported onto the devise 4.9 GitLab locks; the advisories that need a framework major GitLab has not taken (carrierwave, css_parser, lockbox, rubyzip, rack-proxy) are documented in a VEX statement against GitLab's own code. The chart runs webservice behind Workhorse, Sidekiq, Gitaly and gitlab-shell on the bundled PostgreSQL and Valkey, generates every secret once, and its install test pushes commits over HTTP and SSH."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/20
---
