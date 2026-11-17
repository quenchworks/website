---
title: "Paperless-ngx"
date: 2026-11-17
summary: "Paperless-ngx 3.5.0 llegó al catálogo con un chart firmado: gestión documental que escanea, aplica OCR e indexa documentos en papel, sobre PostgreSQL y Valkey. La imagen compila la aplicación Django y la interfaz Angular desde el código fuente y deja fuera la pila opcional de IA. Cada extensión en Rust (el índice de búsqueda tantivy, pydantic-core, granian, rpds-py, watchfiles) se recompila para que el escáner vea sus crates, y esas compilaciones llevaron pyo3 y rustls a versiones corregidas. Al construirla también se vio que un volumen de datos nuevo perdía todas las escrituras del índice de búsqueda, porque Paperless recurría a un índice en memoria cuando faltaba la carpeta del índice; ahora la imagen la crea. El chart ejecuta el servidor web, el worker y el planificador de Celery y el vigilante de la carpeta de consumo en un solo pod, y genera la clave secreta y la contraseña de administración. Su puerta de instalación sube un PDF por la API y lo encuentra con la búsqueda de texto completo, también tras un reinicio y una actualización."
tags: [images, charts]
issue: https://github.com/quenchworks/images/issues/106
---
