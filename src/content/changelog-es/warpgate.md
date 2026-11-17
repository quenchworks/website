---
title: "Warpgate"
date: 2026-11-18
summary: "Warpgate 0.30.4 llegó al catálogo con un chart firmado: un bastión (host de salto) para destinos SSH, HTTPS, MySQL y PostgreSQL con inicio de sesión único, acceso por destino y grabación de sesiones, sin agente en el cliente, así que cada persona sigue usando sus herramientas habituales. La imagen se compila desde el código fuente: el servidor en Rust con cargo auditable, para que el escáner vea cada crate, y la interfaz web con Node. La biblioteca SSH pasó a una versión corregida. El chart lo ejecuta con sus datos en un volumen y una contraseña de administración generada en el primer arranque. Su puerta de instalación inicia sesión en la API web, comprueba que se rechaza una contraseña errónea y que el puerto SSH responde, también tras un reinicio y una actualización. También forma parte del stack VPN, junto a NetBird."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/109
---
