# FOODOOR — AI-Powered Cloud Kitchen Management & Food Delivery Platform

FOODOOR is an intelligent full-stack cloud kitchen ecosystem combining AI demand forecasting, real-time recipe ingredient inventory tracking, a 6-stage Kitchen Display System (KDS), and a consumer food ordering experience.

---

## Architecture Overview

```
                                      ┌────────────────────────────────────────────────┐
                                      │   FOODOOR Single Page Application (React)      │
                                      │   • Landing & Discovery                        │
                                      │   • Food Menu & Cart (INR ₹ Pricing)           │
                                      │   • Live 6-Stage Order Tracker                 │
                                      │   • Kitchen Admin Panel & KDS                  │
                                      └───────────────────────┬────────────────────────┘
                                                              │ REST API
                                                              ▼
                                      ┌────────────────────────────────────────────────┐
                                      │   Node.js Web & API Server (:5000)             │
                                      │   • Serves static SPA bundle from /public      │
                                      │   • Auth (Register, Login, Session Management) │
                                      │   • Order BOM depletion & KDS lifecycle        │
                                      │   • Supabase PostgreSQL & RLS bridge           │
                                      │   • Reverse-proxy to Python AI Service         │
                                      └───────────────────────┬────────────────────────┘
                                                              │ HTTP Proxy
                                                              ▼
                                      ┌────────────────────────────────────────────────┐
                                      │   Python AI Microservice (:5001)               │
                                      │   • Scikit-Learn Demand Forecaster             │
                                      │   • Multi-Criteria Food Recommender            │
                                      │   • Inventory Health & Wastage Optimizer       │
                                      │   • Value-Packed Budget Meal Generator         │
                                      └────────────────────────────────────────────────┘
```

---

## Key Highlights & Capabilities

### 1. Premium UI/UX Design
- **Signature Palette**: Premium Orange (`#F97316`), Deep Charcoal (`#18181B` / `#09090B`), and Crisp White.
- **Typography & Cards**: Refined Google *Plus Jakarta Sans* with subtle glassmorphic elevation.
- **Indian Rupee (₹) Pricing**: Real-world Indian cloud kitchen pricing (₹99, ₹149, ₹199, ₹249, ₹299) and Indian numerical formatting (₹1,299).
- **Responsive Layout**: Fluid design tailored for mobile handsets, tablets, and widescreen desktop monitors.

### 2. Complete Customer Application
- **Personalized Auth & Profiles**: Dedicated Customer and Kitchen Admin accounts with instant demo switcher and secure session management.
- **Category Explorer & Filter**: Veg (`🌿`), Vegan (`🌱`), Gluten-Free (`🌾`), spice meter (0 to 3 flames), and price range sliders.
- **Product Details Drawer**: Full macronutrient breakdown (Protein, Carbs, Fat, Kcal), ingredient transparency, and allergen warnings.
- **Smart Cart & Checkout**:
  - Itemized cart with quantity controls.
  - Promo vouchers (`FOODOOR20` for 20% off, `FOODOOR50` for ₹50 off).
  - Courier tipping (₹0, ₹20, ₹30, ₹50).
  - Indian payment modes: UPI / QR Code, Credit/Debit Cards, Net Banking, and Cash on Delivery.
- **Live 6-Stage Order Tracker**:
  1. `Order Received`
  2. `Order Confirmed`
  3. `Kitchen Preparation`
  4. `Quality Check`
  5. `Ready for Dispatch`
  6. `Delivered`
  - Real-time countdown timer, assigned delivery partner card, and stage timestamps.

### 3. AI-Powered Intelligence
- **Demand Forecasting**:
  - `RandomForestRegressor` and ensemble models trained on operational order volume data.
  - Generates 24-hour predictive curves and 7-day outlooks.
  - Weather simulation: Predicts demand surges (e.g., +32% rain boost).
  - Peak rush hour detection with proactive batch prep alerts.
- **Personalized Food Recommendations**:
  - Content-based & collaborative filtering evaluating customer spice tolerances and dietary profiles.
  - Budget Meal Combos: Dynamically matches mains and desserts for meal savings under ₹299 and ₹349.
- **Smart Inventory Optimization**:
  - Real-time Bill of Materials (BOM) ingredient depletion upon order placement.
  - Automated low-stock and critical-threshold alerts.
  - 77.1% food waste reduction rate estimator with monthly cost savings.

### 4. Admin Control Panel & Live KDS
- **Executive KPI Dashboard**: Total sales revenue in INR, order counts, average order values, active users, and kitchen efficiency ratings.
- **Kitchen Display System (KDS)**:
  - Live Kanban board with real-time ticket stages.
  - One-click stage advancement button for kitchen staff.
- **Menu Management (CRUD)**: Add dishes, edit pricing/prep times, and toggle instant availability.
- **Inventory Control**: Real-time stock counts, minimum thresholds, and 1-click restock actions.
- **Customer Feedback Feed**: Real-time reviews and star rating moderation.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 26)
- Python 3.10+ (tested on Python 3.11 & 3.14) with virtual environment

### 1. Install Dependencies
```bash
# Install Python ML dependencies
pip install -r requirements.txt

# Install Node dependencies
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and verify settings:
```ini
PORT=5000
AI_PORT=5001
AI_SERVICE_URL=http://localhost:5001
NODE_ENV=development
CORS_ORIGIN=*
```

### 3. Launch Both Services Together
Run the unified multi-service launcher:
```bash
npm run dev
# or
npm run start:all
```
This automatically boots:
- 🟣 Python AI Microservice on `http://localhost:5001`
- 🟢 Node.js Web Server on `http://localhost:5000`

Open your browser at:
👉 **`http://localhost:5000`**

---

## Production Deployment

### Option A: Docker / Container (AWS ECS, GCP Cloud Run, DigitalOcean, Railway)
Build and run using the included production `Dockerfile`:
```bash
docker build -t foodoor:latest .
docker run -p 5000:5000 -p 5001:5001 --env-file .env foodoor:latest
```

### Option B: Render (render.yaml Blueprint)
1. Push code to your Git repository.
2. In the Render Dashboard, choose **Blueprints** and select this repository.
3. Render reads `render.yaml` and deploys both the Node web application and Python AI service automatically.

### Option C: Heroku / Railway (Procfile)
The included `Procfile` executes `node scripts/start-all.js`, ensuring both web and AI services run seamlessly within the dyno / container.

---

## Database Integration (Supabase PostgreSQL)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](file:///c:/Users/USER/Desktop/Foodoor/supabase/schema.sql).
4. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your `.env` file.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Comprehensive health check (Node + AI connection status) |
| `POST` | `/api/auth/register` | Customer registration |
| `POST` | `/api/auth/login` | User login (Customer or Kitchen Admin) |
| `GET` | `/api/auth/me` | Current session verification |
| `GET` | `/api/menu` | Full food catalogue |
| `POST` | `/api/orders` | Place new order (with auto BOM inventory depletion) |
| `GET` | `/api/orders` | List order history |
| `PATCH` | `/api/orders/:id/status`| KDS stage advancement |
| `GET` | `/api/ai/forecast` | Scikit-learn demand forecast (proxied to Python AI) |
| `GET` | `/api/ai/recommendations` | AI personalized recommendations |
| `GET` | `/api/ai/budget-meals` | Curated combos under ₹299 / ₹349 |
| `GET` | `/api/ai/inventory-health`| AI inventory health, stock alerts & wastage report |
