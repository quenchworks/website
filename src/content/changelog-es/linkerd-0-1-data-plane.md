---
title: El chart linkerd 0.1.0 añade el plano de datos
date: 2026-10-08
summary: linkerd 0.1.0 despliega el plano de datos linkerd-proxy y ya no ejecuta heartbeat. Es un cambio incompatible; una instalación 0.0.x debe desinstalarse y luego instalarse de nuevo.
tags: ["charts", "breaking"]
---

El chart `linkerd` 0.1.0 incluye ahora el plano de datos: despliega la imagen linkerd-proxy junto al plano de control y el controlador de políticas, y ya no ejecuta heartbeat. El nuevo chart `linkerd-cni` 0.0.2 instala el plugin Linkerd CNI como alternativa a proxy-init.

0.1.0 no es una actualización en el sitio desde 0.0.x. Desinstala primero la versión 0.0.x y luego instala 0.1.0:

```sh
helm uninstall <release> -n <namespace>
helm install <release> oci://ghcr.io/quenchworks/charts/linkerd --version 0.1.0 -n <namespace>
```
