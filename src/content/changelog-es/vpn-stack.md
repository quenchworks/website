---
title: "Stack VPN"
date: 2026-11-17
summary: "Un nuevo chart de stack instala NetBird sobre un PostgreSQL de alta disponibilidad: un clúster Patroni de 3 miembros que elige a su líder a través de la API de Kubernetes y conmuta por error por sí solo, con el Service de la base de datos siguiendo al líder. El panel ejecuta dos réplicas. Management y signal ejecutan una réplica cada uno, porque ejecutarlos en paralelo es una función de NetBird Enterprise; cuando uno se reinicia, los nuevos inicios de sesión y las nuevas conexiones de pares esperan unos segundos mientras los túneles ya establecidos entre pares siguen funcionando. La puerta de publicación elimina al líder de la base de datos y comprueba que NetBird sigue sirviendo el inicio de sesión y sus datos en la réplica promovida."
tags: [charts]
issue: https://github.com/quenchworks/images/issues/108
---
