---
title: Las tres últimas versiones estables, con cada chart refijado
date: 2026-06-22
summary: Cada imagen publica ahora sus tres últimas líneas de versión estables, y cada chart se refijó al digest recién analizado y firmado, y se volvió a publicar.
tags: ["images", "charts", "versions"]
---

Cada imagen del catálogo publica ahora sus tres últimas líneas de versión estables como etiquetas completas X.Y.Z, cada una compilada desde el código fuente, analizada hasta cero CVE corregibles, firmada y fijada por digest. Las páginas de detalle por versión las listan con tamaño, fecha de publicación y digest, y un selector de versiones permite saltar entre ellas.

En el lado de los charts, cada chart se refijó al digest de la imagen recién compilada y analizada, y se volvió a publicar como chart OCI firmado, de modo que una instalación nueva siempre despliega la imagen actual y atestada. CoreDNS y Distribution también se sumaron al catálogo, cada uno como una imagen reforzada más su chart.
