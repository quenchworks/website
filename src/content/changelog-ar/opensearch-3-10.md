---
title: "OpenSearch وDashboards 3.10"
date: 2026-11-19
summary: "انتقل OpenSearch وOpenSearch Dashboards إلى 3.10.0، وخرج Dashboards من تعليقه بسبب الثغرات. كانت إصداراته 3.8 و3.9 تحمل نسخًا من DOMPurify وmaplibre-gl فيها ثغرات معروفة مُجمّعة داخل حزم المتصفح، حيث لا يصل إليها استبدال حزم npm؛ و3.10.0 هو أول إصدار تحمل حزمه DOMPurify 3.4.17 وmaplibre-gl 6.4.1. تعمل الصورة الآن على Node.js 22.23.5 من صورة node الخاصة بـ QuenchWorks، لأن nodejs-22 العام في Wolfi توقف عند 22.23.2، وانتقلت بعض حزم npm المتبقية إلى إصدارات مُصلحة. وينتقل مخططا opensearch وopensearch-dashboards إلى 3.10.0 معًا، لأن Dashboards يجب أن يطابق الإصدار الفرعي لـ OpenSearch."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/32
---
