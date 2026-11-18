---
title: "Zalando Postgres Operator وSpilo"
date: 2026-11-19
summary: "انضم Zalando Postgres Operator إلى الكتالوج مع صورة قاعدة البيانات التي تشغّلها عناقيده. Spilo 18.7 هو PostgreSQL 18 مع Patroni وWAL-G، مبني على Wolfi مع سكربتات Spilo عند commit مثبّت؛ وتُبنى bg_mon وpgextwlist وplpython3u وpgbouncer 1.26.1 من الشيفرة المصدرية (إذ بقي pgbouncer في Wolfi عند 1.24.1 مع ثغرة حرجة)، وتتضمن الصورة pgvector وpg_cron. المشغّل 2.0.3 ملف Go ثابت مبني من الشيفرة المصدرية. يثبّت مخطط postgres-operator كليهما بالبصمة ويشغّل العناقيد دائمًا على صورة Spilo هذه؛ وتنشئ بوابة التثبيت موردًا من نوع postgresql وتتحقق من بلوغه حالة Running مع قائد Patroni على واجهة Kubernetes، ومن وجود الدور وقاعدة البيانات المطلوبين، ومن تشغيل PostgreSQL بالمعرّف 101. يحمل هذا الإصدار الأول PostgreSQL 18 فقط ومن دون timescaledb."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/114
---
