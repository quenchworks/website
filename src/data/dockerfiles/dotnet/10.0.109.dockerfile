# Build stage: restore, then publish the app.
FROM ghcr.io/quenchworks/images/dotnet:10.0.109 AS build
USER root
WORKDIR /src
ENV NUGET_PACKAGES=/tmp/nuget \
    DOTNET_CLI_TELEMETRY_OPTOUT=1

COPY ["App.csproj", "./"]
RUN ["dotnet", "restore", "App.csproj"]
COPY . .
RUN ["dotnet", "publish", "App.csproj", "-c", "Release", "-o", "/app/publish", "--no-restore"]

# Runtime stage: ASP.NET Core runtime, nonroot.
FROM ghcr.io/quenchworks/images/aspnet:10.0.109 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_CLI_TELEMETRY_OPTOUT=1
COPY --from=build /app/publish ./
USER 1001
EXPOSE 8080
ENTRYPOINT ["dotnet", "App.dll"]