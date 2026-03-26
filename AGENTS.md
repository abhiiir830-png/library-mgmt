# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Academic Library Book Management System — a MERN stack (MongoDB, Express 5, React 19, Node.js) application with role-based access control for four user types: student, faculty, librarian, and admin.

## Commands

### Server (from `server/`)
- **Install dependencies**: `npm install`
- **Start dev server (with nodemon)**: `npm run dev` — runs on http://localhost:5000
- **Start production server**: `npm start`
- **Seed database**: `npm run seed` — clears all data and creates sample users/books

### Client (from `client/`)
- **Install dependencies**: `npm install`
- **Start dev server (Vite)**: `npm run dev` — runs on http://localhost:5173
- **Production build**: `npm run build`
- **Lint**: `npm run lint`

### Environment
Requires a `server/.env` file with:
```
PORT=5000
MONGO_URI=<mongodb_connection_string>
JWT_SECRET=<secret_key>
```

## Architecture

### Monorepo Structure
Two independent npm packages (`server/` and `client/`) with no shared workspace config. Each must have dependencies installed and dev servers started separately.

### Backend (`server/`)
- **CommonJS modules** (`require`/`module.exports`), not ESM.
- **Entry point**: `server.js` — sets up Express, CORS (allow-all), JSON body parsing, and mounts route groups under `/api/`.
- **Route → Controller pattern**: Routes in `routes/` define HTTP endpoints and apply middleware; controllers in `controllers/` contain all business logic. Routes and controllers share matching names (e.g., `bookRoutes.js` → `bookController.js`).
- **Middleware chain**: Protected routes use `auth` middleware (JWT verification via `Authorization: Bearer <token>` header, attaches `req.user`) followed by `role(...allowedRoles)` middleware for RBAC.
- **Mongoose models** (`models/`): `User`, `Book`, `Issue`. Issue references User and Book via ObjectId. Issue status values are `Pending`, `Issued`, `Returned`, `Overdue`.
- **Book availability**: `availableCopies` is manually decremented/incremented in the issue controller when issues are approved/returned; there is no Mongoose middleware or trigger for this.
- **Loan periods**: Students get 14 days, faculty get 30 days. Faculty renewal extends due date by 30 days.
- **Overdue detection**: Done lazily — overdue status is checked and updated at read time in `getMyIssues` and `getOverdueBooks`, not via a scheduled job.
- **Password hashing**: bcryptjs with salt rounds of 10, done in the controller (not in a Mongoose pre-save hook). JWT tokens expire in 30 days.

### Frontend (`client/`)
- **ES Modules** with Vite + React 19 + React Router v7.
- **Auth state**: `AuthContext` (React Context) stores user/token in both React state and `localStorage`. The `useAuth()` hook exposes `login`, `register`, `logout`, `hasRole`, and `isAuthenticated`.
- **API client**: `utils/api.js` — Axios instance with base URL `http://localhost:5000/api` and a request interceptor that attaches the JWT token from `localStorage`.
- **Routing**: `App.jsx` defines all routes. `ProtectedRoute` component checks authentication and optionally checks `allowedRoles`. `/dashboard` redirects to the role-specific dashboard via `DashboardRedirect`.
- **Toast notifications**: Custom DOM-based toast system in `utils/toast.js` (no third-party library). Use `toast.success()`, `toast.error()`, etc.
- **One dashboard per role**: `StudentDashboard`, `FacultyDashboard`, `LibrarianDashboard`, `AdminDashboard` — each is a standalone page, not composed from shared sub-components.
- **No test framework** is currently configured for either client or server.

### API Route Permissions
- `/api/auth/*` — public
- `/api/books` GET — public; POST/PUT/DELETE — admin only
- `/api/issues/request`, `/api/issues` GET — student/faculty
- `/api/issues/pending`, approve, reject — librarian only
- `/api/issues/:id/return` — any authenticated user
- `/api/issues/:id/renew` — faculty only
- `/api/users/*` — admin only
- `/api/reports/overdue` — librarian/admin; `/api/reports/analytics` — admin only

### Seed Accounts
After running `npm run seed` in `server/`:
- admin@library.com / admin123
- librarian@library.com / librarian123
- student@library.com / student123
- faculty@library.com / faculty123

## Coding Conventions
- Server uses CommonJS (`require`/`module.exports`); client uses ESM (`import`/`export`).
- All API responses follow `{ success, data/message, count? }` shape.
- Frontend components are `.jsx` files. No TypeScript.
- ESLint is configured for the client only; unused variables starting with uppercase or `_` are allowed.
