# Build stage: restore and publish with the full SDK.
FROM ghcr.io/quenchworks/images/dotnet:10.0.110 AS build
USER root
WORKDIR /src
ENV NUGET_PACKAGES=/tmp/nuget \
    DOTNET_CLI_TELEMETRY_OPTOUT=1

COPY ["App.csproj", "./"]
RUN ["dotnet", "restore", "App.csproj"]
COPY . .
RUN ["dotnet", "publish", "App.csproj", "-c", "Release", "-o", "/app/publish", "--no-restore"]

# This image is the final runtime stage: the ASP.NET Core runtime, nonroot.
FROM ghcr.io/quenchworks/images/aspnet:9.0.119 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish ./
USER 1001
EXPOSE 8080
ENTRYPOINT ["dotnet", "App.dll"]