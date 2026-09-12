# Deployment Guide

## Overview

ShopSphere is designed for flexible deployment across different environments. This guide covers local development, Docker deployment, and production considerations.

## Local Development

### Prerequisites
- Docker Desktop or Docker Engine
- Java 21 JDK
- Maven 3.8+
- Node.js 20+ & npm
- PostgreSQL (or use Docker)

### Starting Local Environment
```bash
# Start all services via Docker Compose
docker-compose up -d

# Wait for services to start
# Check status: docker-compose ps

# Access points:
# - Eureka Server: http://localhost:8761
# - API Gateway: http://localhost:8080
# - Auth Service: http://localhost:8081
# - Product Service: http://localhost:8082
# - Order Service: http://localhost:8083
# - Payment Service: http://localhost:8084
# - Frontend (Vite): http://localhost:5173
```

### Manual Service Start (Without Docker)
```bash
# 1. Start PostgreSQL
# 2. Start Eureka Server
cd service-discovery
mvn spring-boot:run

# 3. Start other services in separate terminals
cd auth-service
mvn spring-boot:run

cd product-service
mvn spring-boot:run

cd order-service
mvn spring-boot:run

cd payment-service
mvn spring-boot:run

cd api-gateway
mvn spring-boot:run

# Frontend
cd frontend
npm run dev
```

### Environment Variables
Create `.env` files in each service directory:

```env
# All services
DATABASE_URL=jdbc:postgresql://localhost:5432/shopsphere
DATABASE_USERNAME=shopsphere
DATABASE_PASSWORD=secret
JWT_SECRET=shopsphere-jwt-secret-key-minimum-256-bits-long
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka

# Specific to each service
SPRING_APPLICATION_NAME=auth-service  # varies per service
SERVER_PORT=8081  # varies per service
```

## Docker Deployment

### Docker Compose
The provided `docker-compose.yml` orchestrates all services:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]
```

### Individual Service Dockerfiles

#### service-discovery/Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/service-discovery-*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8761
```

#### auth-service/Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/auth-service-*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8081
ENV SPRING_PROFILES_ACTIVE=docker
```

#### product-service/Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/product-service-*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8082
ENV SPRING_PROFILES_ACTIVE=docker
```

#### order-service/Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/order-service-*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8083
ENV SPRING_PROFILES_ACTIVE=docker
```

#### payment-service/Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/payment-service-*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8084
ENV SPRING_PROFILES_ACTIVE=docker
```

#### api-gateway/Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=target/api-gateway-*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=docker
```

### Building Docker Images
```bash
# Build all images
docker-compose build

# Build individual image
docker build -t shopsphere/auth-service ./auth-service

# Tag for registry
docker tag shopsphere/auth-service your-registry.io/shopsphere/auth-service:1.0.0

# Push to registry
docker push your-registry.io/shopsphere/auth-service:1.0.0
```

## Production Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set environment variable `VITE_API_BASE_URL` to production gateway URL
3. Build command: `npm run build`
4. Framework: Vite
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend Deployment Options

#### Railway (Free Tier)
1. Create new project on Railway
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Railway auto-deploys on push to main

#### Render (Free Tier)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `mvn clean package`
4. Set start command: `java -jar target/*.jar`
5. Add PostgreSQL database

#### Fly.io (Limited Free Tier)
1. Install Fly CLI: `flyctl auth login`
2. Initialize app: `flyctl launch`
3. Set environment variables in `fly.toml`
4. Deploy: `flyctl deploy`

### Each Service Deployable Independently
```bash
# Example: Deploy just the order service
flyctl deploy --app shopsphere-order

# Or with Docker
docker push shopsphere/order-service:latest
kubectl apply -f k8s/order-service-deployment.yaml
```

### Environment Variables for Production
```env
# Database
DATABASE_URL=postgresql://shopsphere:secret@db.production.shopsphere.co:5432/shopsphere
DATABASE_USERNAME=shopsphere
DATABASE_PASSWORD= ProductionSecret

# JWT
JWT_SECRET=production-jwt-secret-minimum-256-bits-long

# Eureka
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://eureka.production.shopsphere.com/eureka

# Service URLs (auto-discovered via Eureka)
AUTH_SERVICE_URL=https://auth-service.production.shopsphere.com
PRODUCT_SERVICE_URL=https://product-service.production.shopsphere.com
ORDER_SERVICE_URL=https://order-service.production.shopsphere.com
PAYMENT_SERVICE_URL=https://payment-service.production.shopsphere.com

# Frontend
FRONTEND_URL=https://shopsphere.vercel.app

# Application
ACTIVE_PROFILES=prod
```

## Health Checks

### Actuator Endpoints
Each service exposes `/actuator/health`:

```bash
# Check health
curl http://localhost:8081/actuator/health

# Expected response
{
  "status": "UP",
  "components": {
    "database": {
      "status": "UP"
    },
    "eureka": {
      "status": "UP"
    }
  }
}
```

### Kubernetes Liveness/Readiness
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: auth-service
spec:
  containers:
  - name: auth
    livenessProbe:
      httpGet:
        path: /actuator/health
        port: 8081
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /actuator/health
        port: 8081
      initialDelaySeconds: 10
      periodSeconds: 5
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### Backend CI (`.github/workflows/backend-ci.yml`)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-test:
    runs-on: ubuntu-latest
    services:
      postgres:  # PostgreSQL service
        image: postgres:15
        env:
          POSTGRES_DB: shopsphere
          POSTGRES_USER: shopsphere
          POSTGRES_PASSWORD: secret
        ports: ["5432:5432"]
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      - uses: setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven
      
      - name: Cache Maven
        uses: actions/cache@v4
        with:
          path: ~/.m2
          key: maven-${{ runner.os }}-${{ hashFiles('**/pom.xml') }}
      
      - name: Build
        run: mvn clean verify -DskipTests
      
      - name: Test
        run: mvn test
      
      - name: Verify
        run: mvn verify
```

#### Frontend CI (`.github/workflows/frontend-ci.yml`)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install
        run: npm install
      
      - name: Type Check
        run: npx tsc --noEmit
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
```

### Deployment Automation
- **GitHub Actions**: CI only (builds and tests)
- **Manual Deployment**: Deploy via chosen platform (Railway, Render, Fly.io, Vercel)
- **Trigger**: Push to `main` branch triggers CI pipeline
- **Pull Request**: CI runs on PR, blocks merge if tests fail

## Monitoring & Logging

### Actuator Metrics
Each service provides:
- `/actuator/health` - Service health status
- `/actuator/info` - Build information
- `/actuator/metrics` - Custom metrics (if configured)
- `/actuator/loggers` - Logging level configuration

### Logging Configuration
- **Log Level**: `com.shopsphere: INFO`
- **SQL Logging**: `org.hibernate.SQL: DEBUG` (dev only)
- **Console Format**: Human-readable
- **File Logging**: Configured via Logback

### What NOT to Log
- Passwords
- JWT secrets
- Credit card numbers (even demo)
- Database connection strings
- Personal identifiable information (PII)

### Sample Log Output
```
2024-01-15 10:30:00.123 INFO  [auth-service] [nio-8081-exec-1] User logged in successfully - userId:1
2024-01-15 10:30:01.456 DEBUG [product-service] [http-nio-8082-exec-1] GET /api/products 200
2024-01-15 10:30:02.789 INFO [order-service] [kafka-producer-] Order payment succeeded - orderId:1, paymentId:1
```

## Scaling Considerations

### Horizontal Scaling
- Each service can be scaled independently
- Eureka handles service instance registration
- API Gateway distributes requests across instances
- Stateless services (JWT) scale easily

### Vertical Scaling
- Increase JVM heap size
- Add more CPU cores
- Adjust database connection pools

### Performance Tips
- Use connection pooling (HikariCP default)
- Enable query caching where appropriate
- Use indexes on frequently queried columns
- Implement response caching for read-heavy operations
- Monitor GC pauses and adjust heap size

## Backup & Recovery

### Database Backups
```bash
# PostgreSQL backup
pg_dump -U shopsphere -d shopsphere > backup_$(date +%Y%m%d).sql

# Restore
psql -U shopsphere -d shopsphere < backup_20240115.sql
```

### Service Configuration Backup
- Git repository contains all configuration
- Docker Compose file documents service orchestration
- Environment variables documented in `.env.example`

## Disaster Recovery

### Rollback Strategy
1. Previous Docker image tag: `docker rollback shopsphere/auth-service:1.0.0`
2. Database: Point-in-time recovery if using cloud PostgreSQL
3. Configuration: Revert Git changes, redeploy

### High Availability
- Multiple service instances behind load balancer
- Eureka Server redundancy (multiple instances)
- Database replication (read replicas)
- API Gateway session affinity if needed

## Compliance

### Data Privacy
- No sensitive data in logs
- Passwords never stored in plain text
- GDPR-compliant data handling
- Cookie consent for analytics

### Security Best Practices
- Regular dependency updates (`mvn dependency:update-properties`)
- Security scanning (`mvn dependency:check`)
- Secret management (never hardcode, use environment variables)
- HTTPS everywhere in production
- CORS configured for production origins only