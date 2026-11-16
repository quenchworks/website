---
title: "Apprise API"
date: 2026-11-16
summary: "Apprise API 2.1.0 llegó al catálogo con un chart firmado: una llamada REST para enviar notificaciones a más de 100 servicios, con configuraciones guardadas por clave. La imagen ejecuta el propio entorno de upstream (nginx, gunicorn y la limpieza periódica) sobre Python de Wolfi con paquetes nativos de Wolfi. El chart activa la autenticación de upstream y genera la contraseña de administración y la clave secreta de Django, que upstream trae fija. Su puerta de instalación guarda configuraciones, entrega una notificación, detecta un destino que falla y lo conserva todo tras reiniciar el pod y tras una actualización. Al construirla fijamos supervisor-config en 21 imágenes: otro paquete de Wolfi también ofrece ese nombre y ganaba por versión."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/90
---
