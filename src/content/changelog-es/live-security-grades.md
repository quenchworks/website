---
title: Calificaciones de seguridad por imagen y por versión, de un escaneo nocturno
date: 2026-06-29
summary: Un escaneo nocturno con Trivy ahora califica cada imagen y cada versión (de A+ a F) con un desglose completo de severidad de CVE y un conteo de corregibles, visible en las tarjetas y las páginas de detalle y servido desde la API, sin depender de ArtifactHub.
tags: ["security", "images", "charts", "api"]
---

Cada imagen publicada lleva ahora su propia calificación de seguridad de un escaneo nocturno con Trivy que se ejecuta directamente contra los digests de imagen en GHCR, sin depender de ArtifactHub. Cada imagen, y cada una de sus líneas de versión, se califica de A+ (sin CVE) hasta F, con una puntuación de 0 a 100, un desglose completo de critical/high/medium/low/unknown y un conteo de cuántos hallazgos son corregibles (los que una reconstrucción resuelve).

La calificación aparece en cada tarjeta del catálogo y en las páginas de detalle de imagen, chart y runtime, y sigue la versión que selecciones, así que el informe siempre coincide con la etiqueta exacta que estás viendo. Una imagen limpia muestra A+; una imagen que va una reconstrucción por detrás muestra la calificación, las severidades afectadas y cuántos CVE resolvería una reconstrucción.

Los mismos datos se publican a través de la API: `/api/v1/security.json` da el total del catálogo, un resumen por severidad, el número de imágenes que necesitan reconstrucción y un registro por imagen, y cada elemento de images y charts incluye ahora su propio objeto `security`. El escaneo se actualiza a diario y las cifras nunca están escritas a mano.
