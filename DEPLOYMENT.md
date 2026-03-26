# Deployment Guide (Vercel Frontend + Render Backend + MongoDB Atlas)

This guide explains how to deploy your MERN app without needing to push code for every URL change.

## 0) Before you start (important)
1. Make sure your GitHub repo contains both folders:
   - `client/`
   - `server/`
2. Ensure `client/vercel.json` exists (this fixes React Router 404 on refresh/back navigation).
   - Your file is: `client/vercel.json`
3. Your frontend API URL is now controlled by:
   - `VITE_BACKEND_URL` (in Vercel env vars)
   - File: `client/src/utils/api.js`
4. Your backend CORS is controlled by:
   - `FRONTEND_URL` (in Render env vars)
   - File: `server/server.js`

## 1) MongoDB Atlas (Database)
1. Create an account and a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user (username/password).
3. Whitelist your IP or the IP range needed (Render typically needs access; if unsure, use Render's outbound IP if they provide it).
4. Copy the connection string, e.g.:
   - `mongodb+srv://<username>:<password>@<cluster>/<db>?appName=Cluster0`

## 2) Render (Backend Hosting)
1. Go to [Render](https://render.com/) and create a new Web Service.
2. Connect your GitHub repository.
3. Set **Root Directory** to:
   - `server/`
4. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables in Render:
   - `PORT` (you can set `5000`, or use Render's default if preferred)
   - `MONGO_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (any random secret string)
   - `FRONTEND_URL` = your Vercel frontend URL (example: `https://your-app.vercel.app`)

### CORS setup (what you wanted)
Your backend uses:
```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```
So whenever you change the Vercel URL, you only update **Render env var `FRONTEND_URL`**, not the code.

## 3) Vercel (Frontend Hosting)
1. Go to [Vercel](https://vercel.com/) and create a new Project from GitHub.
2. Set **Framework Preset** to “React” (Vite will still build fine).
3. Set **Root Directory** to:
   - `client/`
4. Use these build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables in Vercel:
   - `VITE_BACKEND_URL` = your Render backend base URL + `/api`
     - Example: `https://your-render-service.onrender.com/api`

### React Router 404 fix (index.html fallback)
If you navigate like `/dashboard/student` and refresh, some hosts return 404 unless they always serve `index.html`.
This is fixed by `client/vercel.json` (rewrites all routes to `index.html`).

## 4) End-to-end test checklist (recommended)
1. Run locally:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`
2. Seed your production MongoDB:
   - After deploying backend, run `npm run seed` once (or run it locally and verify your Atlas data).
3. Deploy frontend and verify:
   - Login works
   - Browse books works
   - Role dashboard routes work (refresh should not 404)

## 5) Common problems
### Backend works locally but not in Vercel/Render
- Check that `VITE_BACKEND_URL` points to the deployed backend (not `localhost`).
- Check Render env var `MONGO_URI` and `JWT_SECRET`.

### CORS errors
- Ensure Render env var `FRONTEND_URL` matches your Vercel domain exactly (including `https://`).

### 404 on refresh in Vercel
- Ensure `client/vercel.json` is deployed (Root Directory must be `client/`).

