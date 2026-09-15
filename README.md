# ShopSphere — Full-Stack E-Commerce Microservices Platform

ShopSphere is a production-style e-commerce platform built to demonstrate **Java 21/Spring Boot microservices**, **React/TypeScript frontend engineering**, REST APIs, PostgreSQL, JWT security, Docker, and CI/CD.

The project is also engineered with a strong focus on **accessible frontend interaction**, including keyboard navigation, semantic landmarks, route focus management, accessible navigation state, reduced motion, visible focus, high-contrast support, and form accessibility.

## 🚀 Features

### Customer
- Registration and JWT authentication
- Product browsing, search, filtering and sorting
- Shopping cart management
- Checkout and demo payment processing
- Order history and tracking
- Profile and address management

### Admin
- Analytics dashboard
- Product and inventory management
- Category management
- Order status management
- User and role management

### Platform
- Eureka service discovery
- Spring Cloud API Gateway
- Centralized error handling
- Actuator health monitoring
- PostgreSQL with Flyway migrations
- Docker and Docker Compose
- GitHub Actions CI/CD
- Vercel-ready frontend deployment

---

## ♿ Accessibility Engineering

ShopSphere's frontend includes accessibility engineering aligned with **WCAG 2.2 principles** and common **WAI-ARIA** patterns.

### Implemented

- Semantic `nav` and `main` landmarks
- Skip-to-main-content navigation
- Automatic focus movement to the main region after route changes
- Native keyboard-operable links and buttons
- `aria-current="page"` for current navigation state
- Mobile navigation state with `aria-expanded` and `aria-controls`
- Accessible names for icon-only controls
- Decorative icon suppression with `aria-hidden`
- Consistent `:focus-visible` indicators
- `aria-invalid` support in the shared Input component
- Disabled-state styling and interaction handling
- `prefers-reduced-motion` support
- Forced-colors/high-contrast support
- Responsive touch target sizing on small screens
- Zoom/reflow-oriented responsive layouts

Detailed accessibility engineering and verification scenarios are documented in [`ACCESSIBILITY.md`](./ACCESSIBILITY.md).

---

## 🏗️ Architecture

```text
                         SHOPSPHERE
                             |
                    React + TypeScript
                             |
                       API Gateway
                             |
                       Eureka Server
              _______________|________________
             |          |          |          |
        Auth Service Product     Order      Payment
                     Service    Service     Service
             |          |          |          |
             |__________|__________|__________|
                         |
                  PostgreSQL / Supabase
```

### Microservices

| Service | Responsibility |
|---|---|
| `service-discovery` | Eureka service registration/discovery |
| `api-gateway` | Gateway routing and CORS |
| `auth-service` | Authentication, authorization, JWT and users |
| `product-service` | Products, categories and inventory |
| `order-service` | Cart, orders and order lifecycle |
| `payment-service` | Demo payment processing |

---

## 🛠️ Technology Stack

### Backend
- Java 21 LTS
- Spring Boot 3.2.x
- Spring Cloud 2023.x
- Spring Security + JWT + BCrypt
- Spring Data JPA / Hibernate
- Maven
- Flyway
- OpenAPI / Swagger
- Spring Boot Actuator

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Data & DevOps
- PostgreSQL / Supabase
- Docker / Docker Compose
- GitHub Actions
- Vercel-ready frontend
- Render/Railway-compatible backend deployment

---

## 📂 Repository Structure

```text
ShopSphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── navigation/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── accessibility.css
│   └── package.json
├── auth-service/
├── product-service/
├── order-service/
├── payment-service/
├── api-gateway/
├── service-discovery/
├── ACCESSIBILITY.md
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

## 🔐 Security

- JWT-based stateless authentication
- Role-based authorization
- BCrypt password hashing
- Service-level authorization boundaries
- CORS configuration through the API Gateway
- Environment-based secrets and database configuration

---

## 📡 REST API Examples

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile

GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
PATCH  /api/products/{id}/inventory

POST   /api/orders
GET    /api/orders
GET    /api/orders/{id}
PATCH  /api/orders/{id}/cancel
PATCH  /api/orders/{id}/status

POST   /api/payments
GET    /api/payments/{id}
```

---

## 💻 Local Development

### Prerequisites

- Java 21 JDK
- Maven 3.8+
- Node.js 18+
- npm
- Docker and Docker Compose
- PostgreSQL or Supabase

### Start infrastructure

```bash
docker-compose up -d
```

### Start frontend

```bash
cd frontend
npm install
npm run dev
```

### Frontend build and lint

```bash
cd frontend
npm run build
npm run lint
```

The frontend is available at `http://localhost:5173` and the API Gateway at `http://localhost:8080` when running locally.

---

## 🔄 CI/CD

GitHub Actions provides separate backend and frontend validation pipelines:

- Backend: Maven compilation, tests and verification
- Frontend: dependency installation, TypeScript build, linting and production build

The frontend can be deployed to Vercel and backend services can be deployed independently as Docker services.

---

## 🧪 Accessibility Verification

The repository includes verification scenarios for:

- Keyboard-only navigation
- Skip navigation
- Route focus management
- Accessible navigation state
- Icon-only control names
- Form validation state
- Screen-reader review
- 200%/400% zoom and reflow
- Reduced-motion behavior
- High-contrast/forced-colors behavior

See [`ACCESSIBILITY.md`](./ACCESSIBILITY.md) for the detailed checklist and test scenarios.

---

## 📄 Project Purpose

ShopSphere is a portfolio and academic software engineering project demonstrating full-stack development, distributed-system architecture, secure REST API design, DevOps practices, and accessibility-conscious frontend engineering.
