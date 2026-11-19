---
title: "Imágenes de .NET 10 sobre la versión 10.0.15 de Microsoft"
date: 2026-11-19
summary: "Las imágenes aspnet, dotnet-runtime y dotnet pasaron a 10.0.115 (runtime 10.0.15), que corrige CVE-2026-114149 y CVE-2026-118747. Wolfi sacó sus paquetes de .NET 10 del repositorio público el 2026-11-12, así que la versión corregida nunca iba a llegar allí. Las imágenes empaquetan ahora los tarballs oficiales de Linux de Microsoft, verificados con el sha512 que Microsoft publica, sobre glibc, ICU, zlib y OpenSSL 4 de Wolfi. La imagen del SDK sigue sustituyendo los ensamblados del cliente NuGet por las versiones publicadas. Las tres se escanean sin hallazgos."
tags: [images, security]
issue: https://github.com/quenchworks/images/issues/117
---
