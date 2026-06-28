# Build stage: build the jar with Gradle.
FROM ghcr.io/quenchworks/images/gradle:9.6.1 AS build
USER root
WORKDIR /app
ENV GRADLE_USER_HOME=/tmp/gradle

COPY build.gradle.kts settings.gradle.kts ./
RUN ["gradle", "--no-daemon", "dependencies"]
COPY src ./src
RUN ["gradle", "--no-daemon", "-x", "test", "bootJar"]

# Runtime stage: run the jar on the slim JRE base, nonroot.
FROM ghcr.io/quenchworks/images/jre:25.0.3 AS runtime
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar
USER 1001
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.io.tmpdir=/tmp", "-jar", "/app/app.jar"]