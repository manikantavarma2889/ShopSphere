# ShopSphere — Full-Stack E-Commerce Microservices Platform

ShopSphere is a production-style e-commerce platform built with **Java 21/Spring Boot microservices**, **React/TypeScript**, REST APIs, PostgreSQL, JWT security, Docker, and CI/CD.

The frontend has also been updated with accessibility-focused improvements for keyboard navigation, semantic landmarks, focus management, navigation state, visible focus, reduced motion, high-contrast support, and form validation state.

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

## ♿ Accessibility Improvements

The frontend was updated with the following accessibility improvements:

- Added a semantic `nav` landmark with an accessible navigation label
- Added a **Skip to main content** link
- Added a semantic `main` landmark with a stable `main-content` target
- Added automatic focus movement to the main content after route changes
- Added `aria-current="page"` to identify the current navigation page
- Added accessible labels to the ShopSphere home link and icon-only mobile controls
- Added `aria-expanded` and `aria-controls` to the mobile navigation menu button
- Added automatic mobile-menu closure after route changes
- Added consistent `:focus-visible` indicators
- Added `aria-invalid` support to the shared `Input` component
- Preserved existing form-submit behavior in the shared `Button` component while improving its focus and disabled states
- Added `prefers-reduced-motion` support
- Added forced-colors/high-contrast focus support
- Added minimum touch-target sizing for small-screen buttons and links
- Added an `.sr-only` utility for visually hidden accessible content

Detailed accessibility engineering notes and verification scenarios are documented in [`ACCESSIBILITY.md`](./ACCESSIBILITY.md).

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
- Frontend: dependency installation, TypeScript checking, linting and production build

---

## 🧪 Accessibility Verification

`ACCESSIBILITY.md` contains verification scenarios for the accessibility changes, including:

- Keyboard navigation
- Skip navigation
- Route focus management
- Visible focus indicators
- Current navigation state
- Mobile menu state
- Icon-only control labels
- Form validation state
- Reduced-motion behavior
- High-contrast/forced-colors behavior
- Responsive interaction and touch targets

The documented manual screen-reader, zoom/reflow, and other browser-based scenarios are provided for verification; they are not represented as completed manual tests unless actually performed.

---

## 📄 Project Purpose

ShopSphere is a portfolio and academic software engineering project demonstrating full-stack development, distributed-system architecture, secure REST API design, DevOps practices, and accessibility-conscious frontend engineering.
