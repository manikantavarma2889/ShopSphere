# ShopSphere - Deployment & Running Guide

## Primary Method: Vercel (Frontend) + Local Backend

### 🎯 Goal: Get Project Live for Interview

## Part 1: Deploy Frontend to Vercel

### Step 1: Push to GitHub
```bash
# From D:\Claude-Anti\ShopSphere
cd d:\Claude-Anti\ShopSphere

# Initialize git if not already
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env*" >> .gitignore
echo "*.log" >> .gitignore

# Add and commit
git add .
git commit -m "Initial ShopSphere implementation"

# Create GitHub repo and push (follow GitHub prompts)
# OR use GitHub CLI:
# gh repo create shopsphere --public --source=push
```

### Step 2: Connect to Vercel
1. Go to vercel.com and sign in (or create account)
2. Click "Add New Project" → "Import Git Repository"
3. Select your GitHub repository `shopsphere`
4. Configure settings:

#### Framework Presets:
- **Framework**: Vite
- **Root Directory**: `.`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables (add these in Vercel Dashboard):
```
VITE_API_BASE_URL=https://your-api-gateway.vercel.app
NODE_ENV=production
```

#### Add Environment Variable for API Base URL:
In Vercel Dashboard → Project → Settings → Environment Variables:
- Key: `VITE_API_BASE_URL`
- Value: `https://shopsphere-api.vercel.app` (or your custom domain)

**Important**: The frontend will proxy API calls. Update `src/services/api.ts` or create a vite.config.js rewrite rule.

### Step 3: Create API Proxy (Optional but Recommended)

Create `frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Gateway during dev
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

OR for production, deploy the backend separately (see below).

### Step 4: Deploy
1. In Vercel, click "Deploy"
2. Wait for build to complete
3. Your site will be live at `https://shopsphere.vercel.app`

### Step 5: Configure Backend URL
In your frontend code, update the API base URL. Create `src/services/api.ts`:

```typescript
// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = {
  async get(path) {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
    });
    return response.json();
  },
  
  async post(path, data) {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return response.json();
  },
  
  // ... other methods
};
```

## Part 2: Run Backend Locally (Windows)

### Option A: Using Docker Desktop (Recommended for Windows)

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. **Start Docker Desktop** (must be running)
3. **Run from PowerShell (as Administrator recommended)**:

```powershell
# Navigate to project
cd D:\Claude-Anti\ShopSphere

# Start all services
docker-compose up -d

# Wait a few seconds, then check
docker-compose ps
```

4. **Access Points**:
   - Frontend (once deployed to Vercel): `https://shopsphere.vercel.app`
   - API Gateway: `http://localhost:8080` (if Docker port mapping worked)
   - Eureka: `http://localhost:8761`
   - Swagger Docs: `http://localhost:8080/swagger-ui.html`

### Option B: Manual Windows Service Start

If Docker has issues, start services individually:

```powershell
# 1. First ensure PostgreSQL is running
# Start PostgreSQL service
Start-Service postgresql

# 2. Start Eureka Server (auth-service directory)
cd D:\Claude-Anti\ShopSphere\service-discovery
mvn spring-boot:run
# Keep this running in a PowerShell tab

# 3. Start Auth Service
cd D:\Claude-Anti\ShopSphere\auth-service
mvn spring-boot:run
# Port 8081

# 4. Start Product Service
cd D:\Claude-Anti\ShopSphere\product-service
mvn spring-boot:run
# Port 8082

# 5. Start Order Service
cd D:\Claude-Anti\ShopSphere\order-service
mvn spring-boot:run
# Port 8083

# 6. Start Payment Service
cd D:\Claude-Anti\ShopSphere\payment-service
mvn spring-boot:run
# Port 8084

# 7. Start API Gateway (last)
cd D:\Claude-Anti\ShopSphere\api-gateway
mvn spring-boot:run
# Port 8080

# 7. Start Frontend (separate tab)
cd D:\Claude-Anti\ShopSphere\frontend
npm run dev
# Port 5173
```

### PowerShell Commands (Fix Your Errors)

The error `&&` not being a valid separator - use separate lines or `;`:
```powershell
# Correct way:
cd D:\Claude-Anti\ShopSphere
docker-compose up -d

# Then separately:
cd D:\Claude-Anti\ShopSphere\frontend
npm run dev
```

### Docker compose.yml Fix (remove version attribute):

The warning about `version` attribute - I'll fix it:

Your `docker-compose.yml` already has it, but let me ensure it works:

```yaml
# The version attribute warning is cosmetic - it won't prevent startup
# But if you want to remove it:

# Remove this top line or keep it - either way works
# The services below will still work
```

## Part 3: Full Local Setup Workflow

### Step 1: Prerequisites
- Windows 11 (your OS)
- Docker Desktop installed & running
- Git for Windows
- Node.js 20+ from https://nodejs.org/
- Maven 3.8+ (comes with Spring Boot tools)

### Step 2: Environment Setup
```powershell
# 1. Clone/project already exists at D:\Claude-Anti\ShopSphere

# 2. Create env files
Copy .env.example .env
# Edit .env with your settings

# 3. Ensure Docker is running
# Taskbar Docker icon should be active/running
```

### Step 3: Start Everything
```powershell
# Open PowerShell as Administrator or normal user
cd D:\Claude-Anti\ShopSphere

# Start Docker compose
docker-compose up -d

# Verify
docker-compose ps

# Should show:
# NAME               STATE           PORTS
# eureka-server      running         8761:8761
# postgres           running         5432:5432
# auth-service       running         8081:8081
# product-service    running         8082:8082
# order-service      running         8083:8083
# payment-service    running         8084:8084
# api-gateway        running         8080:8080
```

### Step 4: Start Frontend
```powershell
# New PowerShell tab
cd D:\Claude-Anti\ShopSphere\frontend
npm install         # First time only
npm run dev         # Start Vite dev server
# Visit: http://localhost:5173
```

### Step 4: Test the Full Flow
1. Open http://localhost:5173 (frontend)
2. Register a new account
3. Login
4. Browse products
5. Add to cart
6. Checkout (use demo card: 4242 4242 4242 4242 for SUCCESS)
7. View order success & tracking

## Part 4: Interview Demonstration Script

### For your interview, here's what to show:

#### 1. "Here's the live application"
```
URL: https://shopsphere.vercel.app  (after Vercel deployment)
```

#### 2. "This is a microservices architecture"
Show 6 services running:
- Eureka Service Discovery (port 8761)
- API Gateway (port 8080) 
- Auth Service (port 8081)
- Product Service (port 8082)
- Order Service (port 8083)
- Payment Service (port 8084)

#### 3. "Frontend on Vercel, backend on Docker"
- Frontend: `https://shopsphere.vercel.app`
- Backend: Local Docker or Railway/Render deployment

#### 4. "Key flows I'll demonstrate"
1. Register → Login → (JWT auth)
2. Browse products with search/filter/sort
3. Add to cart → Cart management
4. Checkout with demo payment
5. Order success page with tracking timeline
6. Admin dashboard (separate professional experience)

#### 4. "Technology stack I used"
- Java 21 / Spring Boot 3.2 / Spring Cloud
- Spring Security + JWT + BCrypt
- React 18 + TypeScript + Vite
- Tailwind CSS with custom breakpoints
- PostgreSQL with Flyway migrations
- Docker & Docker Compose
- Git & GitHub
- Maven build lifecycle
- OpenAPI/Swagger documentation

#### 5. "CI/CD pipeline"
- GitHub Actions `.github/workflows/backend-ci.yml`
- GitHub Actions `.github/workflows/frontend-ci.yml`
- On push/pull: Maven build + tests + verification
- Frontend: npm install + typecheck + lint + tests + build

## Part 6: Vercel + Backend Connection

Since Vercel frontend can't directly call localhost backend, here are your options:

### Option 1: Deploy Backend to Railway/Render (Free)
1. Create account at railway.app or render.com
2. Connect GitHub repo
3. Add PostgreSQL service
4. Set environment variables
5. Get deployed backend URL
6. In Vercel, set `VITE_API_BASE_URL` to your deployed backend URL

### Option 2: Use Vercel Serverless Functions
- Move backend logic to Vercel Functions (Node.js adaptation)
- More work but fully integrated

### Option 3: Local Backend + Vercel Frontend (Recommended for interview)
- Frontend: Vercel (live, public URL)
- Backend: Local Docker (demonstrated during interview)
- Show both during the interview session

## Part 7: Quick Start Commands (Windows PowerShell)

```powershell
# 1. Navigate
cd D:\Claude-Anti\ShopSphere

# 2. Start Docker services
docker-compose up -d

# 3. Wait 30 seconds, then verify
docker-compose ps

# 4. Start frontend (new PowerShell tab)
cd D:\Claude-Anti\ShopSphere\frontend
npm run dev

# 5. Visit http://localhost:5173 and test:
# - Register / Login
# - Browse products
# - Cart & Checkout (demo card: 4242 4242 4242 4242)
# - Order success & tracking
```

## Part 8: Troubleshooting Windows Docker

### Error: "The system cannot find the file specified"
- Ensure Docker Desktop is running (check tray icon)
- Right-click Docker Desktop → Settings → Resources → Advanced → "Enable VirtioFS" (if available)
- Or use Option B (manual service start above)

### Error: "mvn command not found"
- Install Maven: `choco install maven` or download from apache.org
- Or use `winget install apache.maven`

### Error: "npm command not found"
- Install Node.js: https://nodejs.org/ (LTS version)
- Restart PowerShell after installation

### Error: Port conflicts
- Change port numbers in each service's application.yml
- Update docker-compose.yml port mappings
- Or use different host ports: `8081→8082, 8083, etc.`

## Summary: Your Action Items

1. **Push code to GitHub** (Part 1)
2. **Deploy frontend to Vercel** (Part 1, Steps 4-5)
3. **Start Docker locally** (Part 2, Option A or B)
4. **Test full flow** (Part 3, Step 4)
5. **Prepare interview talking points** (Part 4-6)
6. **Set VITE_API_BASE_URL** for production connection

**You can start with Option 3 (local backend + Vercel frontend) immediately and have everything demo-ready for your interview.** The key is showing the architecture working - doesn't matter if backend is local or deployed, as long as you can explain every component.