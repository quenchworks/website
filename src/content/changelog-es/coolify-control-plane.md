---
title: Coolify llega como una oleada de plano de control reforzada
date: 2026-06-14
summary: La pila de Coolify ya está en el catálogo como imágenes reforzadas y sin CVE (0-CVE) y un chart paraguas que puedes desplegar como una sola unidad.
tags: ["images", "charts", "coolify"]
---

Coolify se suma al catálogo como una oleada completa de plano de control. Se publican cuatro imágenes nuevas reforzadas y fijadas por digest: coolify-app, coolify-realtime, coolify-helper y un almacén de respaldo postgresql-15. Sobre ellas se asienta el chart paraguas de Coolify, que conecta las piezas con valores predeterminados de producción para que puedas levantar todo el plano de control desde una sola release en lugar de ensamblar los servicios por tu cuenta.

Cada imagen de la oleada se construye desde el código fuente sobre Wolfi, se escanea hasta cero CVE corregibles, se firma con cosign e incluye un SBOM en formato SPDX y una atestación de procedencia de compilación SLSA.
