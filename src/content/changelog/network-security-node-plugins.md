---
title: Calico, Cilium, Kubescape and the Secrets Store CSI Driver
date: 2026-10-08
summary: Four charts join the catalog (calico, cilium, kubescape-operator and secrets-store-csi-driver), along with their images and the istio-cni, ztunnel and linkerd-cni node images.
tags: ["images", "charts", "website"]
---

Four charts shipped at 0.0.2. `calico` installs Calico 3.32.0 through the Tigera operator 1.42.2. `cilium` installs Cilium 1.20.2. `kubescape-operator` runs Kubescape's configuration and image vulnerability scanning in the cluster. `secrets-store-csi-driver` installs the Secrets Store CSI Driver 1.6.1.

The images behind them shipped with them: the Calico set (node, cni, kube-controllers, typha, csi, pod2daemon-flexvol, node-driver-registrar, key-cert-provisioner) and tigera-operator; secrets-store-csi-driver 1.6.1 and 1.5.7; kubescape 4.0.15, the CLI with ksserver; and kubescape-operator, kubevuln, kubescape-storage, kubescape-node-agent and kubescape-synchronizer. Three service-mesh node images also shipped: istio-cni and ztunnel (1.29.8, 1.30.5 and 1.31.1) and linkerd-cni 1.7.0. Their charts wait until the mesh's data plane ships.

On the site, /stacks now uses the same design as the charts catalog, and each chart page links every image the chart deploys, with its version and Trivy grade.
