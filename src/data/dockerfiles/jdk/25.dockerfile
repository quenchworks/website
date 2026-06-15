# Build stage: compile and package the jar with the full JDK.
FROM ghcr.io/quenchworks/images/jdk:25 AS build
USER root
WORKDIR /app

COPY . .
RUN ["javac", "-d", "/app/out", "@sources.txt"]
RUN ["jar", "--create", "--file", "/app/app.jar", "--main-class", "App", "-C", "/app/out", "."]

# Runtime stage: run the jar on the slim JRE base, nonroot.
FROM ghcr.io/quenchworks/images/jre:25 AS runtime
WORKDIR /app
COPY --from=build /app/app.jar /app/app.jar
USER 1001
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.io.tmpdir=/tmp", "-jar", "/app/app.jar"]