---
title: "GitLab CE ‏19.6"
date: 2026-11-19
summary: "انضم GitLab CE إلى الفهرس في أربع صور ومخطط واحد: gitlab-rails (‏Puma وSidekiq ومهام الترحيل في صورة واحدة)، وgitlab-workhorse، وgitaly، وgitlab-shell، وكلها مبنية من مصدر gitlab-foss المرخّص بـ MIT على Wolfi. تُبنى كل حزمة gem أصلية في gitlab-rails مقابل مكتبات Wolfi، وتُجمَّع الواجهة الأمامية أثناء البناء. انتقلت اثنتا عشرة حزمة gem إلى إصدارات مُصلحة؛ وطُبّقت إصلاحات الأمان في devise 5.0 على devise 4.9 الذي يثبّته GitLab؛ أما الثغرات التي تتطلب إصدارًا رئيسيًا لم يعتمده GitLab بعد (carrierwave وcss_parser وlockbox وrubyzip وrack-proxy) فموثّقة في بيان VEX مقابل شيفرة GitLab نفسها. يشغّل المخطط webservice خلف Workhorse، وSidekiq، وGitaly، وgitlab-shell فوق PostgreSQL وValkey المضمّنين، ويولّد كل سر مرة واحدة، ويرفع اختبار التثبيت فيه commits عبر HTTP وSSH."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/20
---
