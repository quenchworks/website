---
title: "Cilium Envoy"
date: 2026-11-18
summary: "Cilium Envoy llegó al catálogo: el proxy L7 que hay detrás de las políticas de red de Cilium que entienden HTTP, Kafka y DNS, compilado desde el código fuente de cilium/proxy en el commit que fija el chart de cilium 1.20, sobre Envoy 1.39.6 con los parches de Cilium. La imagen incluye cilium-envoy, cilium-envoy-starter y cilium-envoy-healthcheck, además del inventario de las bibliotecas C y C++ compiladas dentro del binario estático, que la compilación escanea por CPE junto al escaneo habitual de la imagen. Por el camino, el crate de resolución DNS en Rust pasó a una versión corregida. El chart de cilium (0.0.20) ahora lo ejecuta como un DaemonSet cilium-envoy y activa las políticas L7; su puerta de instalación aplica una CiliumNetworkPolicy HTTP y comprueba que un GET permitido recibe 200 y uno denegado recibe 403 de Envoy."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/111
---
