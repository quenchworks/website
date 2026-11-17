---
title: "Wiki.js"
date: 2026-11-17
summary: "Wiki.js 3.4.0 llegó al catálogo con un chart firmado: una wiki con editores Markdown y visual, sincronización con Git y muchos proveedores de inicio de sesión, sobre PostgreSQL. La imagen compila desde el código fuente el frontend, los bloques de contenido y el backend sobre Node 26, con fast-uri, fast-xml-parser, undici y yaml subidos a versiones corregidas, y precarga el polyfill de Temporal que usa el propio frontend, porque el Node 26 de Wolfi se compila sin él. La extensión opcional de Puppeteer queda fuera: descarga su propio Chrome. El chart fija el primer administrador con una contraseña generada, donde upstream crearía admin@example.com con la contraseña 12345678. Su puerta de instalación inicia sesión por la API, comprueba que se rechazan 12345678 y una contraseña incorrecta, y conserva la cuenta tras un reinicio y una actualización."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/22
---
