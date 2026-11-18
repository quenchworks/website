---
title: "OpenSearch and Dashboards 3.10"
date: 2026-11-19
summary: "OpenSearch and OpenSearch Dashboards moved to 3.10.0, and Dashboards is out of its CVE hold. Dashboards 3.8 and 3.9 shipped DOMPurify and maplibre-gl releases with known flaws compiled into their browser bundles, where swapping the npm packages could not reach them; 3.10.0 is the first release whose bundles carry DOMPurify 3.4.17 and maplibre-gl 6.4.1. The image now runs on Node.js 22.23.5 from the QuenchWorks node image, because the public Wolfi nodejs-22 stopped at 22.23.2, and a few remaining npm packages are moved to fixed releases. The opensearch and opensearch-dashboards charts move to 3.10.0 together, since Dashboards must match the OpenSearch minor."
tags: [images, charts, security]
issue: https://github.com/quenchworks/images/issues/32
---
