---
title: Se publica Harbor 2.14.4
date: 2026-06-09
summary: Una oleada de registro multiimagen lleva Harbor 2.14.4 al catálogo, con un chart paraguas que levanta el registro completo.
tags: ["images", "charts", "harbor"]
---

Harbor 2.14.4 ya está en el catálogo. La release llega como una oleada multiimagen que cubre los componentes del registro, cada uno construido desde el código fuente sobre Wolfi, escaneado hasta cero CVE corregibles y fijado por digest. Un chart paraguas une los componentes en una sola release para que puedas levantar un registro completo sin conectar los servicios entre sí por tu cuenta.

La imagen del core incluye un parche para orígenes CSRF de confianza, de modo que el inicio de sesión en la interfaz funcione detrás de un endpoint externo; ajusta el host de acceso para que coincida con el endpoint externo que hayas configurado.
