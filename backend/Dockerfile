# Multi-stage Dockerfile for TanStack Playground Spring Boot Backend
# Stage 1: Build JAR with Maven & Eclipse Temurin 21
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Cache Maven wrapper and dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal hardened runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for health check and create non-root user
RUN apk add --no-cache curl && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dspring.profiles.active=prod", "-jar", "app.jar"]

