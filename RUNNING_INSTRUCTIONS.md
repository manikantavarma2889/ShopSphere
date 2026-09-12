# ShopSphere - Running and Deployment Instructions

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Running Each Service Individually](#running-each-service-individually)
4. [Using Docker Compose](#using-docker-compose)
5. [Frontend Development](#frontend-development)
6. [Production Deployment](#production-deployment)
7. [Interview Demonstration](#interview-demonstration)
8. [Database Requirements](#database-requirements)

## Prerequisites

### Backend
- Java 21 JDK installed
- Maven 3.8+
- PostgreSQL 15+ (or Docker)
- Node.js 20+ & npm (for frontend)

### Frontend
- Node.js 20+ & npm
- Git

### Environment Variables
Create `.env` files in each service directory based on `.env.example`:

```env
# All services
DATABASE_URL=jdbc:postgresql://localhost:5432/shopsphere
DATABASE_USERNAME=shopsphere
DATABASE_PASSWORD=secret
JWT_SECRET=shopsphere-jwt-secret-key-minimum-256-bits-long
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka
SERVER_PORT=8081  # varies per service

# Specific to each service
SPRING_APPLICATION_NAME=auth-service  # auth-service, product-service, etc.
```

## Local Development

### Option 1: Using Docker Compose (Recommended)

```bash
# From the ShopSphere root directory
cd d:\Claude-Anti\ShopSphere

# Start all services
docker-compose up -d

# Wait for services to initialize
# Check status
docker-compose ps

# Access points:
# - Eureka Server:          http://localhost:8761
# - API Gateway:            http://localhost:8080
# - Auth Service:           http://localhost:8081
# - Product Service:        http://localhost:8082
# - Order Service:          http://localhost:8083
# - Payment Service:        http://localhost:8084
# - Swagger UI:             http://localhost:8080/swagger-ui.html
# - Frontend (Vite):        http://localhost:5173
```

#### Service Health Checks
```bash
# Check Eureka
curl http://localhost:8761/eureka/apps

# Check Gateway health
curl http://localhost:8080/actuator/health

# Check Auth service
curl http://localhost:8081/actuator/health

# Verify services registered in Eureka
open http://localhost:8761
```

#### Stopping Services
```bash
docker-compose down
```

### Option 2: Manual Service Start (Without Docker)

#### Start PostgreSQL
```bash
# If using local PostgreSQL
service postgresql start
# Or via Docker
docker run -d \
  -e POSTGRES_DB=shopsphere \
  -e POSTGRES_USER=shopsphere \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  --name postgres postgres:15
```

#### Start Eureka Server
```bash
cd d:\Claude-Anti\ShopSphere\service-discovery
mvn spring-boot:run
# Runs on http://localhost:8761
```

#### Start Each Microservice
Open separate terminal windows and run:

```bash
# Auth Service
cd d:\Claude-Anti\ShopSphere\auth-service
mvn spring-boot:run
# Runs on http://localhost:8081

# Product Service
cd d:\Claude-Anti\ShopSphere\product-service
mvn spring-boot:run
# Runs on http://localhost:8082

# Order Service
cd d:\Claude-Anti\ShopSphere\order-service
mvn spring-boot:run
# Runs on http://localhost:8083

# Payment Service
cd d:\Claude-Anti\ShopSphere\payment-service
mvn spring-boot:run
# Runs on http://localhost:8084

# API Gateway
cd d:\Claude-Anti\ShopSphere\api-gateway
mvn spring-boot:run
# Runs on http://localhost:8080
```

#### Start Frontend
```bash
cd d:\Claude-Anti\ShopSphere\frontend
npm install       # first time only
npm run dev
# Runs on http://localhost:5173
```

### Option 3: Individual Service Compilation

```bash
# From the ShopSphere root
mvn clean package -DskipTests  # builds all services

# Or build individual service
cd d:\Claude-Anti\ShopSphere\auth-service
mvn clean package

# Run the jar
java -jar target/auth-service-*.jar
```

## Frontend Development

```bash
cd d:\Claude-Anti\ShopSphere\frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173

# Build for production
npm run build
```

### Frontend Breakpoint Testing

The Tailwind CSS now includes these custom breakpoints:
- `xs` → 320px (small mobile)
- `sm` → 375px (iPhone 8/SE)
- `md` → 390px (Android phones)
- `lg` → 430px (larger Android)
- `xl` → 768px (iPad/tablet)
- `2xl` → 1024px (large tablet/laptop)
- `3xl` → 1280px (laptop)
- `4xl` → 1440px (desktop)
- `5xl` → 1920px (large desktop)

To test at different breakpoints:
1. Open Chrome DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select "Responsive" mode
4. Drag the window width to test each breakpoint
5. Or use the device toolbar presets (iPhone SE, iPhone 12, iPad, etc.)

Key areas to verify:
- Navbar collapses to mobile menu below 768px
- Product grid adjusts columns (4→2→1)
- Cart page layout stacks appropriately
- Checkout form remains usable
- Admin tables remain readable

## Using Docker Compose (Recommended)

The `docker-compose.yml` file orchestrates all services:

```bash
cd d:\Claude-Anti\ShopSphere
docker-compose up -d  # Start all services in background
docker-compose ps     # Check running services
docker-compose logs -f  # Follow logs
docker-compose down     # Stop all services
```

### Docker Compose Services
| Service | Port | Description |
|---------|------|-------------|
| eureka-server | 8761 | Service Discovery |
| postgres | 5432 | PostgreSQL Database |
| auth-service | 8081 | Authentication |
| product-service | 8082 | Product Catalog |
| order-service | 8083 | Order Management |
| payment-service | 8084 | Demo Payments |
| api-gateway | 8080 | API Gateway & Routing |

## Production Deployment

### Vercel (Frontend)

1. **Connect GitHub Repository**
   - Go to vercel.com and import your GitHub repo

2. **Configure Environment Variables**
   - `VITE_API_BASE_URL`: Production API Gateway URL
   - `NEXT_PUBLIC_NODE_ENV`: production

3. **Build Settings**
   - Framework: Vite
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**
   - Push to main branch triggers automatic deploy
   - Or manually deploy from Vercel dashboard

### Backend Deployment Options

#### Railway (Free Tier)
1. Create account at railway.app
2. New project → Connect GitHub repo
3. Add PostgreSQL service
4. Set environment variables in dashboard
5. Railway auto-deploys on push to main

#### Render (Free Tier)
1. Create account at render.com
2. New Web Service → Connect GitHub
3. Build Command: `mvn clean package`
4. Start Command: `java -jar target/*.jar`
5. Add PostgreSQL database service

#### Fly.io (Limited Free Tier)
```bash
# Install Fly CLI
flyctl auth login

# Initialize app
flyctl launch

# Set environment variables in fly.toml
flyctl secrets set JWT_SECRET=your-secret
flyctl secrets set DATABASE_URL=your-db-url

# Deploy
flyctl deploy
```

### Each Service Deployable Independently
```bash
# Example: Deploy order service only
flyctl deploy --app shopsphere-order

# Or with Docker
docker build -t shopsphere/order-service ./order-service
docker push your-registry.io/shopsphere/order-service:latest
kubectl apply -f k8s/order-service-deployment.yaml
```

## Database Requirements

### Local Development
- **PostgreSQL** required with database `shopsphere`
- User: `shopsphere`, Password: `secret`
- Schemas automatically created by Flyway migrations
- Allow connections on port 5432

### Supabase (Production)
If using Supabase for production:

1. **Create Supabase Project**
   - Go to supabase.io and create a new project
   - Note your project ref: `https://<project-ref>.supabase.co`

2. **Obtain Connection Details**
   - Project URL: `https://<project-ref>.supabase.co`
   - Anonymous key: From Settings → API
   - Service role key: From Settings → API (backend only)
   - Database password: From Settings → Database → Connect

3. **Configure Environment Variables**
   ```env
   DATABASE_URL=postgresql://shopsphere:your-password@db.<project-ref>.supabase.co:5432/shopsphere
   DATABASE_USERNAME=shopsphere
   DATABASE_PASSWORD=your-password
   JWT_SECRET=your-jwt-secret
   EUREKA_SERVER_URL=https://eureka.<project-ref>.supabase.co/eureka
   ```

4. **Run Flyway Migrations**
   ```bash
   # With spring.flyway.schemas configured in application-prod.yml
   mvn flyway:migrate
   ```

5. **Important Notes**
   - Never expose Supabase secrets in frontend code
   - Use anon key only for client-side SDK usage
   - Service role key for backend only
   - Enable Row Level Security (RLS) for production
   - Monitor query performance and add indexes as needed

### Database Schema Ownership
Each service owns its schema:
- `auth_schema` → users, addresses
- `product_schema` → products, categories, inventory
- `order_schema` → orders, order_items, carts, cart_items
- `payment_schema` → payments

Flyway migrations create these schemas automatically on first run.

## Interview Demonstration

### Running for an Interviewer

#### Option A: Docker Compose (Easiest)
```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Wait 2-3 minutes for services to start
# 3. Open these URLs:
#    - Frontend:      http://localhost:5173
#    - Eureka:        http://localhost:8761
#    - API Docs:      http://localhost:8080/swagger-ui.html

# 3. Demonstrate flows:
#    - Register & login
#    - Browse products
#    - Add to cart & checkout
#    - Demo payment (use card: 4242 4242 4242 4242 for SUCCESS)
#    - View order tracking
#    - Admin dashboard
```

#### Option 2: Manual Services
```bash
# Start PostgreSQL first
# Then start each service in order:
# 1. Eureka Server
# 2. Auth Service
# 3. Product Service
# 4. Order Service
# 5. Payment Service
# 6. API Gateway
# 6. Frontend

# Demo the same flows as above
```

### Key Demo Points for Interviewers
1. **Microservices architecture**: Show 6 separate services running
2. **Service discovery**: Show how services register in Eureka
3. **API Gateway**: Demonstrate routing through http://localhost:8080
4. **JWT authentication**: Login, obtain token, access protected endpoints
5. **Role-based access**: Show CUSTOMER vs ADMIN differences
6. **Payment system**: Use demo card 4242 4242 4242 4242 for SUCCESS
7. **Order flow**: Complete checkout → payment → success → tracking
8. **Database schemas**: Point out separate schemas ownership
9. **CI/CD**: Mention GitHub Actions pipelines
10. **Docker**: Show docker-compose orchestrates everything

## Common Issues and Fixes

### Service Won't Start
- Check `.env` file exists and has correct values
- Verify PostgreSQL is running and accessible
- Ensure port 5432 (or your DB port) is not blocked
- Check `mvn clean package` compiles without errors

### CORS Errors
- Ensure gateway has correct CORS config
- Frontend origin must be in allowed-origins list
- Check `application.yml` CORS configuration

### Eureka Registration Failures
- Verify Eureka server is running on port 8761
- Check `eureka.client.service-url.defaultZone` setting
- Ensure services have correct `spring.application.name`

### Frontend Can't Reach API
- Verify backend services are running
- Check `VITE_API_BASE_URL` if using proxy
- Ensure CORS allows the frontend origin

### Payment Always Fails
- Use demo card: `4242 4242 4242 4242` for SUCCESS
- Use demo card: `4000 0000 0000 0002` for FAILED
- CVV doesn't matter in demo mode

## Project Structure Summary

```
d:\Claude-Anti\ShopSphere\
├── shopsphere/              # Parent POM
├── api-gateway/             # Spring Cloud Gateway (port 8080)
├── service-discovery/       # Eureka Server (port 8761)
├── auth-service/            # Authentication (port 8081)
├── product-service/         # Product Catalog (port 8082)
├── order-service/           # Cart & Orders (port 8083)
├── payment-service/         # Demo Payments (port 8084)
├── frontend/                # React + TypeScript + Vite + Tailwind
├── docs/                    # 7 comprehensive documentation files
├── .github/workflows/       # CI/CD pipelines
├── docker-compose.yml       # Local development orchestration
├── .env.example            # Environment variable templates
└── RUNNING_INSTRUCTIONS.md # This file
```

## Checklist Before Interview

- [ ] `docker-compose up -d` starts all services
- [ ] Frontend loads at http://localhost:5173
- [ ] Can register & login with demo accounts
- [ ] Product browsing works with search/filter/sort
- [ ] Cart add/remove functions
- [ ] Demo payment with card 4242 4242 4242 4242
- [ ] Order success page shows correctly
- [ ] Order tracking timeline visible
- [ ] Admin dashboard accessible
- [ ] responsive at mobile breakpoints (test with dev tools)
- [ ] Swagger docs at http://localhost:8080/swagger-ui.html
- [ ] GitHub repo pushes successfully
- [ ] CI/CD pipelines pass