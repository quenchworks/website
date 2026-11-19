---
title: "GitLab CE 19.6"
date: 2026-11-19
summary: "GitLab CE llega al catálogo como cuatro imágenes y un chart: gitlab-rails (Puma, Sidekiq y las tareas de migración en una sola imagen), gitlab-workhorse, gitaly y gitlab-shell, todas compiladas desde el código MIT de gitlab-foss sobre Wolfi. Cada gem nativa de gitlab-rails se compila contra las bibliotecas de Wolfi, y el frontend se compila durante la construcción. Doce gems pasan a versiones corregidas; las correcciones de seguridad de devise 5.0 se aplican sobre el devise 4.9 que GitLab fija; los avisos que exigen una versión mayor que GitLab no ha adoptado (carrierwave, css_parser, lockbox, rubyzip, rack-proxy) quedan documentados en una declaración VEX contra el propio código de GitLab. El chart ejecuta webservice detrás de Workhorse, Sidekiq, Gitaly y gitlab-shell sobre el PostgreSQL y el Valkey incluidos, genera cada secreto una sola vez, y su prueba de instalación sube commits por HTTP y por SSH."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/20
---
