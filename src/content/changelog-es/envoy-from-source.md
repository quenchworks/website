---
title: "Envoy compilado desde el código fuente"
date: 2026-11-17
summary: "Envoy ahora se compila desde el código fuente con Bazel en lugar del paquete de Wolfi. Wolfi público dejó de publicar Envoy en la 1.38.1, que tenía un hallazgo CRÍTICO en brotli cuya corrección solo existe en revisiones no públicas. Envoy 1.40.2 la sustituye en los charts envoy, contour y envoy-gateway. Un Envoy estático oculta sus bibliotecas C y Rust a los escáneres de imágenes, así que la imagen incluye un inventario de todo lo compilado (los módulos de Bazel enlazados con sus versiones e identificadores CPE, y el Cargo.lock de Rust) y la compilación pasa dos controles: Trivy y un análisis CPE de ese inventario. Ese análisis encontró y corrigió c-ares y rustls; tres hallazgos que no aplican a esta compilación (correcciones ya presentes en los commits fijados, código de servidor no enlazado) se cubren con declaraciones VEX con la evidencia."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/107
---
