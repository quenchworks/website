---
title: "kustomize, tflint and task"
date: 2026-11-16
summary: "Three command-line tools joined the catalog as images: kustomize 5.8.3 (template-free overlays and patches for Kubernetes manifests), tflint 0.66.0 (Terraform linter with its terraform ruleset bundled) and task 3.54.0 (a Taskfile runner with a built-in shell, so plain commands need no /bin/sh). All built from source with their vulnerable dependencies raised to fixed versions, and each smoke test runs the tool offline on a read-only root filesystem."
tags: [images]
issue: https://github.com/quenchworks/images/issues/67
---
