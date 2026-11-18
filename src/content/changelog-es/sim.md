---
title: "Sim"
date: 2026-11-19
summary: "Sim llegó al catálogo como sustituto autoalojado de Flowise, que sus mantenedores archivaron el 2026-08-13. Sim es un editor visual de flujos de trabajo para agentes de IA. Tres imágenes se compilan desde el código fuente de la versión de simstudioai/sim sobre Bun de Wolfi: la aplicación Next.js (con isolated-vm recompilado contra Node.js 24 de Wolfi y sin npm en la imagen), el servidor de colaboración en tiempo real y las migraciones de la base de datos. Las tres mantienen better-auth 1.6.27, la versión de upstream, porque la línea 1.7 que la corrige rompe la compilación; cada uno de sus avisos, incluida la CVE-2026-114607 crítica, necesita un plugin o un ajuste que Sim no usa, y el VEX publicado indica el archivo y la línea de cada uno. El chart de sim ejecuta la aplicación con las migraciones como contenedor de inicio, el servidor en tiempo real, un CronJob por calendario para los flujos programados y el sondeo de webhooks, y el PostgreSQL incluido con pgvector. Su puerta de instalación se registra, rechaza una contraseña incorrecta, inicia sesión, comprueba el saludo del servidor en tiempo real, ejecuta una vez las tareas programadas y conserva la sesión tras un reinicio y una actualización."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/115
---
