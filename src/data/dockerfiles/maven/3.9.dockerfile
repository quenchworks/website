# Build stage: resolve dependencies, then package the jar.
FROM ghcr.io/quenchworks/images/maven:3.9 AS build
USER root
WORKDIR /app
ENV MAVEN_OPTS=-Dmaven.repo.local=/tmp/.m2

COPY pom.xml ./
RUN ["mvn", "-B", "-Dmaven.repo.local=/tmp/.m2", "dependency:go-offline"]
COPY src ./src
RUN ["mvn", "-B", "-o", "-Dmaven.repo.local=/tmp/.m2", "package", "-DskipTests"]

# Runtime stage: run the jar on the slim JRE base, nonroot.
FROM ghcr.io/quenchworks/images/jre:21 AS runtime
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
USER 1001
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.io.tmpdir=/tmp", "-jar", "/app/app.jar"]