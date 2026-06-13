# Deploying Ilm Naafi to Vercel (Full-Stack Deployment Guide)

This guide documents the procedures for successfully deploying this full-stack **Vite (React) + Express (Node.js)** application on Vercel. 

---

## Architecture Context
Traditional Node/Express apps run as persistent stateful containers. Vercel, however, operates on a **Serverless/Edge architecture**. 

To deploy a full-stack Express app on Vercel, there are two primary methods:
1. **Serverless Monolith (All-in-One)**: Wrapping the Express server into a Vercel Serverless Function `/api/index.ts` and configuring Vercel router `vercel.json` to route endpoints correctly.
2. **Decoupled Architecture (Recommended for high traffic)**: Deploying the React client statically on Vercel for fast CDNs, while deploying the Express server as a microservice on container platforms (Google Cloud Run, Render, or Railway).

---

## Method 1: All-in-One Serverless Monolith (Vercel Only)

Vercel can serve both your static assets and route backend requests through serverless functions. 

### 1. Create a Vercel Router (`vercel.json`)
Create a `vercel.json` file in the root directory to direct `/api/*` requests to your backend serverless entry point:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 2. Configure the Backend Entry Point (`api/index.ts`)
Instead of running a persistent socket listener via `app.listen()`, export your Express application so that Vercel's serverless runtime can handle requests.

Create a folder called `api/` and a file named `api/index.ts` containing the following structure:

```ts
import app from "../server";

// Export the Express instance for Vercel's Serverless Function engine
export default app;
```

> **Note**: Modify your main `server.ts` to export your `app` default or named instance (e.g., `export default app;`), and avoid executing `app.listen` if the file is imported elsewhere, or guard it with `if (require.main === module)` / `if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL)`.

---

## Method 2: Decoupled Architecture (Recommended)

For mission-critical production applications, separating the static client assets from the persistent server container delivers the best performance and scalability.

### Step A: Deploy the Frontend to Vercel
1. Log in to Vercel and import your repository.
2. Set the Framework Preset to **Vite**.
3. **Build Command**: `vite build` or `npm run build` (Ensure client-side files are outputted to `dist/`).
4. **Output Directory**: `dist`
5. **Environment Variables**: Add `VITE_API_BASE_URL` pointing to the deployed backend URL (e.g. `https://my-express-api.railway.app`).

### Step B: Deploy the Backend to Cloud Run, Fly.io, or Render
1. Deploy the original Docker/Node server to Google Cloud Run, Railway, or Render.
2. Ensure the backend handles CORS requests from your Vercel frontend domain:
```ts
// server.ts
import cors from "cors";
app.use(cors({
  origin: process.env.CLIENT_URL || "https://your-ilmnaafi-frontend.vercel.app",
  credentials: true
}));
```

---

## Environment Variables Configuration

No matter which method you choose, you must configure your Gemini key and secure session configurations in the **Vercel Project Dashboard** -> **Settings** -> **Environment Variables**:

1. **`GEMINI_API_KEY`**: Set your real Google Gemini API Key.
2. **`COOKIE_SECRET`**: Set a randomized string for session cookie hashing.
3. **`NODE_ENV`**: Set to `production`.
