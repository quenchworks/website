---
title: "donetick"
date: 2026-11-16
summary: "donetick 0.1.86 joined the catalog with a signed chart: a chore and task manager for households and teams with recurring schedules, assignees, points and notifications. The image builds the Go backend (with a coherent set of dependency floors, ClickHouse driver included) and the React frontend from source. The chart generates the JWT secret, keeps it on upgrade so sessions survive, and has a switch to close signups. Its install gate signs up, creates a chore, reads it after a pod restart with the old token, then closes signups and checks the account still works."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/89
---
