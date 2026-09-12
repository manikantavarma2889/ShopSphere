FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/api-gateway-1.0.0.jar
COPY ${JAR_FILE} /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]