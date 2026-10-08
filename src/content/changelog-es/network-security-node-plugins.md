---
title: Calico, Cilium, Kubescape y Secrets Store CSI Driver
date: 2026-10-08
summary: Cuatro charts se suman al catálogo (calico, cilium, kubescape-operator y secrets-store-csi-driver), junto con sus imágenes y las imágenes de nodo istio-cni, ztunnel y linkerd-cni.
tags: ["images", "charts", "website"]
---

Se publicaron cuatro charts en la versión 0.0.2. `calico` instala Calico 3.32.0 mediante el operador de Tigera 1.42.2. `cilium` instala Cilium 1.20.2. `kubescape-operator` ejecuta en el clúster el escaneo de configuración y de vulnerabilidades de imágenes de Kubescape. `secrets-store-csi-driver` instala Secrets Store CSI Driver 1.6.1.

Con ellos se publicaron las imágenes en las que se basan: el conjunto de Calico (node, cni, kube-controllers, typha, csi, pod2daemon-flexvol, node-driver-registrar, key-cert-provisioner) y tigera-operator; secrets-store-csi-driver 1.6.1 y 1.5.7; kubescape 4.0.15, la CLI con ksserver; y kubescape-operator, kubevuln, kubescape-storage, kubescape-node-agent y kubescape-synchronizer. También se publicaron tres imágenes de nodo para service mesh: istio-cni y ztunnel (1.29.8, 1.30.5 y 1.31.1) y linkerd-cni 1.7.0. Sus charts esperan a que se publique el plano de datos del mesh.

En el sitio, /stacks usa ahora el mismo diseño que el catálogo de charts, y cada página de chart enlaza cada imagen que despliega, con su versión y su calificación de Trivy.
