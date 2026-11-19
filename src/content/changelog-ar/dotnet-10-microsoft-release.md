---
title: "صور .NET 10 على إصدار Microsoft ‏10.0.15"
date: 2026-11-19
summary: "انتقلت صور aspnet وdotnet-runtime وdotnet إلى 10.0.115 (بيئة التشغيل 10.0.15)، وهو ما يُصلح CVE-2026-114149 وCVE-2026-118747. نقلت Wolfi حزم .NET 10 من مستودعها العام في 2026-11-12، فلم يكن الإصدار المُصلح ليصل إليه. تُحزّم الصور الآن ملفات tarball الرسمية من Microsoft لنظام Linux، بعد التحقق منها ببصمة sha512 التي تنشرها Microsoft، فوق glibc وICU وzlib وOpenSSL 4 من Wolfi. وما زالت صورة SDK تستبدل مكتبات عميل NuGet بالإصدارات المنشورة. وتُفحص الصور الثلاث دون أي نتائج."
tags: [images, security]
issue: https://github.com/quenchworks/images/issues/117
---
