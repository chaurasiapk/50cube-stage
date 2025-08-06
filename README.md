Here is a consolidated README that covers BOTH the backend (Express/MongoDB) and the frontend (React/Vite/Tailwind).

# 50cube – Monorepo Guide

A full-stack MERN application featuring interactive learning modules, a credits-based reward system, merchandise redemption, and rich admin tooling.

## Contents

1. Project Structure
2. Tech Stack
3. Prerequisites
4. Quick Start (Full Stack)
5. Environment Variables
6. Backend
   - Setup & Scripts
   - API Endpoints
   - Running Tests
7. Frontend
   - Setup & Scripts
   - Available Pages
   - Running Tests
8. Seed & Sample Data
9. Accessibility & Styling Notes

## 1. Project Structure

## 2. Tech Stack

- Frontend – React 18, Vite, Tailwind CSS, i18next
- Backend – Node.js 18, Express 4, MongoDB 6 (Mongoose 7)

## 3. Prerequisites

- Node.js v16+
- npm 8+ (or pnpm / yarn)
- MongoDB (local or Atlas)

## 4. Quick Start (Root-level script)

The proxy in frontend/vite.config.js forwards /api/\* requests to the backend during development.

## 5. Environment Variables

Create two .env files based on the samples provided.

### backend/.env

### frontend/.env

## 6. Backend

### 6.1 Setup & Scripts

Scripts:

- npm run dev – nodemon with auto-reload
- npm run start – production server
- npm run seed – seed database with sample data

### 6.2 Core API Endpoints (REST)

```
User Routes
GET /api/users/profile
→ Get current user profile

Merchandise Routes
GET /api/merch/catalog
→ Get merchandise catalog

POST /api/merch/quote
→ Get merchandise quote including credits

POST /api/merch/redeem
→ Redeem merchandise

Admin Routes
GET /api/admin/metrics
→ Platform KPIs (supports since=ISO)

GET /api/admin/lanes/impact
→ Get lane impact scores

PUT /api/admin/lanes/:id/state
→ Rotate lane state
```

See individual route files in backend/routes/ for detailed schema.

## 7. Frontend

### 7.1 Setup & Scripts

Scripts:

- npm run dev – Vite dev server + HMR
- npm start – Vite dev server + HMR
- npm run build – production build (dist/)
- npm run preview – preview built site

### 7.2 Available Pages / Routes

```
Path Component Access

"/login" Login.jsx Public
"/" Dashboard.jsx Auth
"/merch-catalog" MerchStore.jsx Auth
"/admin-metrics" AdminMetrics.jsx Admin
"/lane-console" LaneConsole.jsx Admin
```

## 8. Seed & Sample Data

From backend/ :

```
node seed.js      # inserts demo users, products, lanes, etc.
```

Idempotent – running multiple times will upsert existing records.

## 9. Accessibility & Styling Notes

- Tailwind utility classes enforce WCAG AA color contrast.
- All interactive elements have focus rings via focus-visible: variants.
- Responsive layout uses CSS Grid and Flexbox, tested in major browsers.
  Happy hacking! Feel free to open issues or PRs if you run into problems.
