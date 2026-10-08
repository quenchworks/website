---
title: المخطط linkerd 0.1.0 يضيف طبقة البيانات
date: 2026-10-08
summary: ينشر linkerd 0.1.0 طبقة البيانات linkerd-proxy ولم يعد يشغّل heartbeat. إنه تغيير كاسر؛ يجب إلغاء تثبيت أي تثبيت 0.0.x ثم التثبيت من جديد.
tags: ["charts", "breaking"]
---

يتضمن المخطط `linkerd` بالإصدار 0.1.0 الآن طبقة البيانات: فهو ينشر الصورة linkerd-proxy إلى جانب طبقة التحكم ووحدة التحكم في السياسات، ولم يعد يشغّل heartbeat. ويثبّت المخطط الجديد `linkerd-cni` بالإصدار 0.0.2 إضافة Linkerd CNI بديلًا عن proxy-init.

الإصدار 0.1.0 ليس ترقية في المكان من 0.0.x. ألغِ تثبيت إصدار 0.0.x أولًا، ثم ثبّت 0.1.0:

```sh
helm uninstall <release> -n <namespace>
helm install <release> oci://ghcr.io/quenchworks/charts/linkerd --version 0.1.0 -n <namespace>
```
