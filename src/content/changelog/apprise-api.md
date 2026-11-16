---
title: "Apprise API"
date: 2026-11-16
summary: "Apprise API 2.1.0 joined the catalog with a signed chart: one REST call to send notifications to 100+ services, with configs stored under keys. The image runs upstream's own runtime (nginx, gunicorn, pruner) on Wolfi python with native packages from Wolfi. The chart turns upstream's authentication on and generates the admin password and the Django secret key, which upstream ships fixed. Its install gate stores configs, delivers a notification, sees a failing target reported, and keeps everything across a pod restart and an upgrade. While building it we pinned supervisor-config in 21 images: an unrelated Wolfi package also provides that name and won on version."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/90
---
