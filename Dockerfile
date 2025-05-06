# === Stage 1: Build frontend ===
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === Stage 2: Build backend ===
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

# === Stage 3: Create final image ===
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy backend jar
COPY --from=backend-build /app/target/*.jar app.jar

# Copy frontend static files into resources (Spring Boot will serve them)
COPY --from=frontend-build /app/dist/ /app/static/

# Set env to tell Spring where to look for static files
ENV SPRING_WEB_RESOURCES_STATIC_LOCATIONS=file:/app/static/

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
