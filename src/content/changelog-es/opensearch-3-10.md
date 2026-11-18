---
title: "OpenSearch y Dashboards 3.10"
date: 2026-11-19
summary: "OpenSearch y OpenSearch Dashboards pasaron a 3.10.0, y Dashboards sale de su retención por CVE. Dashboards 3.8 y 3.9 incluían versiones de DOMPurify y maplibre-gl con fallos conocidos compiladas en sus bundles del navegador, donde cambiar los paquetes npm no llegaba; 3.10.0 es la primera versión cuyos bundles llevan DOMPurify 3.4.17 y maplibre-gl 6.4.1. La imagen se ejecuta ahora sobre Node.js 22.23.5 de la imagen node de QuenchWorks, porque el nodejs-22 público de Wolfi se quedó en 22.23.2, y algunos paquetes npm restantes pasan a versiones corregidas. Los charts opensearch y opensearch-dashboards pasan a 3.10.0 a la vez, porque Dashboards debe coincidir con la versión menor de OpenSearch."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/32
---
