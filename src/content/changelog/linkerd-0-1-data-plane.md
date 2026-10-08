---
title: The linkerd chart 0.1.0 adds the data plane
date: 2026-10-08
summary: linkerd 0.1.0 deploys the linkerd-proxy data plane and no longer runs heartbeat. It is a breaking change; a 0.0.x install must be uninstalled, then installed again.
tags: ["charts", "breaking"]
---

The `linkerd` chart 0.1.0 now includes the data plane: it deploys the linkerd-proxy image next to the control plane and policy controller, and it no longer runs heartbeat. The new `linkerd-cni` chart 0.0.2 installs the Linkerd CNI plugin as an alternative to proxy-init.

0.1.0 is not an in-place upgrade from 0.0.x. Uninstall the 0.0.x release first, then install 0.1.0:

```sh
helm uninstall <release> -n <namespace>
helm install <release> oci://ghcr.io/quenchworks/charts/linkerd --version 0.1.0 -n <namespace>
```
