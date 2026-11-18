---
title: "Cilium Envoy"
date: 2026-11-18
summary: "انضم Cilium Envoy إلى الكتالوج: وكيل الطبقة السابعة الذي تعتمد عليه سياسات الشبكة في Cilium التي تفهم HTTP وKafka وDNS، مبنيًا من مصدر cilium/proxy عند الـ commit الذي يثبّته مخطط cilium 1.20، فوق Envoy 1.39.6 مع رقع Cilium. تضم الصورة cilium-envoy وcilium-envoy-starter وcilium-envoy-healthcheck، إضافة إلى جرد مكتبات C وC++ المضمّنة في الملف التنفيذي الثابت، والذي يفحصه البناء حسب CPE إلى جانب الفحص المعتاد للصورة. وفي الطريق انتقلت مكتبة تحليل DNS المكتوبة بلغة Rust إلى إصدار مُصلح. يشغّله مخطط cilium (0.0.20) الآن كـ DaemonSet باسم cilium-envoy ويفعّل سياسات الطبقة السابعة؛ وتطبّق بوابة التثبيت سياسة CiliumNetworkPolicy لـ HTTP وتتحقق من أن طلب GET المسموح يتلقى 200 وأن المرفوض يتلقى 403 من Envoy."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/111
---
