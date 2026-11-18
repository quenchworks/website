---
title: "Zalando Postgres Operator y Spilo"
date: 2026-11-19
summary: "El Zalando Postgres Operator llegó al catálogo junto con la imagen de base de datos que ejecutan sus clústeres. Spilo 18.7 es PostgreSQL 18 con Patroni y WAL-G, compilado sobre Wolfi con los scripts de Spilo en un commit fijado; bg_mon, pgextwlist, plpython3u y pgbouncer 1.26.1 se compilan desde el código fuente (el pgbouncer de Wolfi sigue en 1.24.1 con una CVE crítica), e incluye pgvector y pg_cron. El operador 2.0.3 es un binario estático de Go compilado desde el código fuente. El chart postgres-operator fija ambos por digest y siempre ejecuta los clústeres con este Spilo; su puerta de instalación crea un recurso postgresql y comprueba que llega a Running con un líder de Patroni en la API de Kubernetes, que existen el rol y la base de datos pedidos y que PostgreSQL se ejecuta como uid 101. Esta primera versión incluye solo PostgreSQL 18, sin timescaledb."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/114
---
