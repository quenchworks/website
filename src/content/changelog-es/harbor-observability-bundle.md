---
title: Paquete de observabilidad de Harbor
date: 2026-06-11
summary: Un meta-chart combina Prometheus y Grafana con un dashboard de Harbor listo para usar, de modo que un registro nuevo arranca ya instrumentado.
tags: ["charts", "observability", "harbor"]
---

Vigilar un registro de Harbor ya no implica montar la pila de monitorización a mano. El nuevo meta-chart de observabilidad despliega Prometheus y Grafana juntos y entrega un dashboard de Harbor precargado en Grafana, de modo que un registro nuevo arranca ya instrumentado para tasas de peticiones, almacenamiento y salud de la replicación.

Ambas imágenes de respaldo son las compilaciones reforzadas y sin CVE (0-CVE) del catálogo, fijadas por digest. La compilación de Grafana es la release OSS (AGPL) v13.0.2 en el puerto 3000.
