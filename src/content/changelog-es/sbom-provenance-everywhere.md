---
title: Cada imagen incluye ahora un SBOM y procedencia SLSA
date: 2026-06-13
summary: Junto a su firma de cosign, cada imagen incluye ahora un SBOM en formato SPDX y una atestación de procedencia de compilación SLSA sobre el mismo digest.
tags: ["security", "images", "supply-chain"]
---

Los metadatos de cadena de suministro son ahora estándar en todo el catálogo de imágenes. Cada imagen ya incluía una firma de cosign sin clave; ahora lleva además una lista de materiales de software (SBOM) en formato SPDX y una declaración de procedencia de compilación SLSA, adjuntas al mismo digest como referrers OCI.

El SBOM enumera cada paquete de la imagen para que puedas auditar y clasificar contra el digest exacto que ejecutas. La procedencia vincula ese digest con el flujo de trabajo de GitHub Actions, el commit y el runner que lo produjeron. Puedes verificar ambos por tu cuenta con `gh attestation verify`, sin ninguna clave que gestionar por ninguna de las partes. Consulta la documentación de SBOM y procedencia para ver los comandos exactos.
