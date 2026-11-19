---
title: ".NET 10 images on Microsoft's 10.0.15 release"
date: 2026-11-19
summary: "The aspnet, dotnet-runtime and dotnet images moved to 10.0.115 (runtime 10.0.15), which fixes CVE-2026-114149 and CVE-2026-118747. Wolfi moved its .NET 10 packages out of the public repository on 2026-11-12, so the fixed build was never going to arrive there. The images now package Microsoft's official Linux release tarballs, checked against the sha512 Microsoft publishes, on Wolfi glibc, ICU, zlib and OpenSSL 4. The SDK image still swaps in the released NuGet client assemblies. All three scan with no findings."
tags: [images, security]
issue: https://github.com/quenchworks/images/issues/117
---
