---
title: "VPN stack"
date: 2026-11-17
summary: "A new stack chart puts NetBird on a highly available PostgreSQL in one install: a 3-member Patroni cluster that elects its leader through the Kubernetes API and fails over on its own, with the database Service following the leader. The dashboard runs two replicas. Management and signal run one replica each, because running them side by side is a NetBird Enterprise feature; when one restarts, new logins and new peer connections wait a few seconds while tunnels already up between peers keep running. The release gate deletes the database leader and checks that NetBird still serves sign-in and its data on the promoted replica."
tags: [charts]
issue: https://github.com/quenchworks/images/issues/108
---
