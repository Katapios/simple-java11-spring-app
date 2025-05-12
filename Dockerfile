# --- STAGE 1: Build the app ---
FROM maven:3.8.5-openjdk-11-slim AS build
WORKDIR /app

# Кэшим зависимости
COPY pom.xml .
COPY frontend/package*.json ./frontend/
RUN mvn dependency:go-offline

# Копируем остальное и собираем
COPY . .
RUN mvn clean package -DskipTests

# --- STAGE 2: Run the app ---
FROM openjdk:11-jre-slim
WORKDIR /app

# Копируем скомпилированный .war
COPY --from=build /app/target/SpringHello-0.0.1-SNAPSHOT.war app.war

EXPOSE 8081
CMD ["java", "-jar", "app.war"]
