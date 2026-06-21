# Build stage: compile and package the jar with the full JDK.
FROM ghcr.io/quenchworks/images/jdk:17.0.19 AS build
USER root
WORKDIR /app
ENV MAVEN_OPTS=-Dmaven.repo.local=/tmp/.m2

COPY pom.xml ./
RUN ["./mvnw", "-B", "-Dmaven.repo.local=/tmp/.m2", "dependency:go-offline"]
COPY src ./src
RUN ["./mvnw", "-B", "-o", "-Dmaven.repo.local=/tmp/.m2", "package", "-DskipTests"]

# This image is the final runtime stage: run the jar, nonroot.
FROM ghcr.io/quenchworks/images/jre:17.0.19 AS runtime
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
USER 1001
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.io.tmpdir=/tmp", "-jar", "/app/app.jar"]
