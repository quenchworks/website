---
title: "Yopass"
date: 2026-11-16
summary: "Yopass 16.1.0, 16.0.1 y 15.1.0 llegaron al catálogo con un chart firmado: comparte contraseñas y otros secretos mediante enlaces de un solo uso. El navegador cifra cada secreto con OpenPGP y el servidor solo guarda el texto cifrado en Memcached o Redis. La imagen incluye el servidor, la CLI yopass y la interfaz web, todo compilado desde el código fuente; el chart incluye nuestro memcached. Su puerta de instalación guarda un secreto cifrado con gpg, lo lee una vez tras reiniciar el pod del servidor, rechaza texto plano y secretos reutilizables, y repite la prueba por TLS."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/83
---
