---
title: "Calibre-Web"
date: 2026-11-17
summary: "Calibre-Web 0.6.27 llegó al catálogo con un chart firmado: explorar, leer y descargar una biblioteca de libros electrónicos guardada en una base de datos de Calibre, con usuarios, estanterías y un feed OPDS. La imagen ejecuta la aplicación desde el código fuente en un entorno virtual de Python sobre los paquetes nativos de Wolfi, y levanta los topes de versión que mantenían pypdf, cryptography, tornado, certifi y regex por debajo de sus correcciones (pypdf sigue en 6.x). Upstream crea admin con la contraseña admin123; el contenedor de inicio del chart fija la contraseña desde un Secret generado antes de cada arranque. Su puerta de instalación inicia sesión por el formulario, comprueba que se rechazan admin123 y una contraseña incorrecta, y conserva la cuenta tras un reinicio y una actualización."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/104
---
