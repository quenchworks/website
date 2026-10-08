---
title: Calico وCilium وKubescape وSecrets Store CSI Driver
date: 2026-10-08
summary: تنضم أربعة مخططات إلى الكتالوج (calico وcilium وkubescape-operator وsecrets-store-csi-driver)، مع صورها وصور العُقد istio-cni وztunnel وlinkerd-cni.
tags: ["images", "charts", "website"]
---

صدرت أربعة مخططات بالإصدار 0.0.2. يثبّت `calico` الإصدار Calico 3.32.0 عبر مشغّل Tigera بالإصدار 1.42.2. ويثبّت `cilium` الإصدار Cilium 1.20.2. ويشغّل `kubescape-operator` فحص الإعدادات وفحص ثغرات الصور من Kubescape داخل العنقود. ويثبّت `secrets-store-csi-driver` الإصدار Secrets Store CSI Driver 1.6.1.

وصدرت معها الصور التي تعتمد عليها: مجموعة Calico (node وcni وkube-controllers وtypha وcsi وpod2daemon-flexvol وnode-driver-registrar وkey-cert-provisioner) وtigera-operator؛ وsecrets-store-csi-driver بالإصدارين 1.6.1 و1.5.7؛ وkubescape 4.0.15، أداة سطر الأوامر مع ksserver؛ وkubescape-operator وkubevuln وkubescape-storage وkubescape-node-agent وkubescape-synchronizer. وصدرت أيضًا ثلاث صور عُقد لشبكة الخدمات: istio-cni وztunnel (1.29.8 و1.30.5 و1.31.1) وlinkerd-cni 1.7.0. تنتظر مخططاتها حتى تصدر طبقة البيانات الخاصة بشبكة الخدمات.

وعلى الموقع، تستخدم صفحة /stacks الآن تصميم كتالوج المخططات نفسه، وتربط صفحة كل مخطط كل صورة ينشرها، مع إصدارها ودرجة Trivy الخاصة بها.
