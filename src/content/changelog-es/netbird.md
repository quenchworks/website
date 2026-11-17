---
title: "NetBird"
date: 2026-11-17
summary: "NetBird 0.83.1 llegó al catálogo con un chart firmado: una VPN en malla sobre WireGuard con inicio de sesión único, políticas de acceso y pares de enrutamiento. Las nueve imágenes que publica upstream se compilan desde el código fuente (el cliente, management, signal, relay, el servidor combinado, el proxy inverso, el servidor de subidas y nblink), además del panel (Next.js, servido por nginx desde un sistema de archivos raíz de solo lectura). Una dependencia no pudo pasar a su versión corregida: todas las versiones corregidas de pion/stun requieren una biblioteca de transporte que el cliente de NetBird aún no admite, así que la corrección de dos líneas de upstream se aplica a una copia incluida en el código y se documenta en una declaración VEX. El chart ejecuta management con el inicio de sesión integrado de NetBird (sin proveedor de identidad externo), signal, relay y el panel sobre PostgreSQL detrás de un solo host, con pares de enrutamiento opcionales. Su puerta de instalación comprueba el emisor del inicio de sesión, que la API rechaza llamadas anónimas, que existe el primer administrador, la configuración del panel y el relay, también tras un reinicio y una actualización."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/108
---
