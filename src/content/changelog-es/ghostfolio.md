---
title: "Ghostfolio"
date: 2026-11-17
summary: "Ghostfolio 3.100.0 llegó al catálogo con un chart firmado: gestión patrimonial y seguimiento de carteras de acciones, ETF y criptomonedas, sobre PostgreSQL y Valkey. La imagen compila la API y el cliente Angular desde el código fuente, pero solo incluye las dependencias que la API importa de verdad, donde la imagen de upstream lleva toda la cadena de compilación; el resto de correcciones llega por overrides. Un hallazgo no tiene corrección: el fallo de firmas RSA de node-forge, al que no llega ningún camino del código, así que lo cubre una declaración VEX que cita las líneas exactas. El chart genera la sal de los tokens y la clave JWT e incluye un Valkey protegido con contraseña. Su puerta de instalación comprueba la salud, que la primera cuenta es la de administración, que su token inicia sesión mientras uno incorrecto se rechaza, y que la cuenta sobrevive a un reinicio y a una actualización."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/105
---
