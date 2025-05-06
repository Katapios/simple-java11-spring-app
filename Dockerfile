# Строим фронтенд
FROM node:20 AS frontend-builder
WORKDIR /app
COPY frontend/ ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Строим backend
FROM maven:3.9.4-eclipse-temurin-17 AS backend-builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Финальный контейнер
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Копируем собранный jar
COPY --from=backend-builder /app/target/*.jar app.jar

# Копируем фронтенд как статику
COPY --from=frontend-builder /app/frontend/dist /app/public

EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
