# Build stage: restore and publish the worker/console app with the SDK.
FROM ghcr.io/quenchworks/images/dotnet:10.0.100 AS build
USER root
WORKDIR /src
ENV NUGET_PACKAGES=/tmp/nuget \
    DOTNET_CLI_TELEMETRY_OPTOUT=1

COPY ["Worker.csproj", "./"]
RUN ["dotnet", "restore", "Worker.csproj"]
COPY . .
RUN ["dotnet", "publish", "Worker.csproj", "-c", "Release", "-o", "/app/publish", "--no-restore"]

# This image is the final runtime stage: the plain .NET runtime, nonroot.
FROM ghcr.io/quenchworks/images/dotnet-runtime:10.0.100 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
USER 1001
ENTRYPOINT ["dotnet", "Worker.dll"]