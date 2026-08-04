# Deployment Guide — Jyoti.AI Portfolio

This guide covers deploying the backend to **Render** and the frontend to **Vercel**. Other platforms (Railway, Fly.io, Netlify) follow similar patterns.

---

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Python](https://python.org/) ≥ 3.11
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- [Groq API Key](https://console.groq.com/keys)

---

## Backend Deployment (Render)

### 1. Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free (or Starter for production) |

### 2. Set Environment Variables

| Variable | Value | Notes |
|---|---|---|
| `GROQ_API_KEY` | `gsk_...` | **Required** — your Groq API key |
| `MODEL_NAME` | `llama-3.3-70b-versatile` | Optional — defaults to this value |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Comma-separated allowed origins |
| `DEBUG` | `False` | **Must be False** in production |
| `APP_NAME` | `Persona AI Backend` | Optional display name |

### 3. Verify Deployment

```bash
# Health check
curl https://your-backend.onrender.com/health

# Expected response
{"status":"healthy","model":"llama-3.3-70b-versatile"}
```

---

## Frontend Deployment (Vercel)

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**
2. Import your GitHub repository
3. Configure:

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 2. Set Environment Variables

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com` |

> **Important**: Vite environment variables must be prefixed with `VITE_` to be exposed to client-side code.

### 3. Verify Deployment

Visit `https://your-app.vercel.app` and:
1. ✅ Page loads with the hero section
2. ✅ Chat box is visible and accepts input
3. ✅ AI responds with streaming text
4. ✅ Job match analysis returns structured results

---

## CORS Configuration

The backend allows these origins by default:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
- Any `https://*.vercel.app` (for preview deploys)
- Whatever you set in `FRONTEND_URL`

For production, set `FRONTEND_URL` to your exact production domain:

```
FRONTEND_URL=https://jyoti-ai.vercel.app
```

---

## Production Checklist

| Item | Status |
|---|---|
| `DEBUG=False` in production | ☐ |
| `GROQ_API_KEY` rotated and set via env vars (not committed) | ☐ |
| `FRONTEND_URL` set to production domain | ☐ |
| Health check endpoint responding | ☐ |
| CORS tested (browser console shows no errors) | ☐ |
| Chat streaming works end-to-end | ☐ |
| Job match returns valid JSON | ☐ |
| Print/PDF export renders correctly | ☐ |
| No API keys in git history | ☐ |

---

## Troubleshooting

### Backend won't start
- Check that `GROQ_API_KEY` is set — the app validates at startup and fails fast with a clear error.
- Verify `pyproject.toml` dependencies are installable on the target platform.

### CORS errors in browser console
- Add your frontend domain to `FRONTEND_URL` in the backend env vars.
- Ensure the URL doesn't have a trailing slash.

### LLM responses are slow or timeout
- Groq's free tier has rate limits. Check your [Groq dashboard](https://console.groq.com/) for usage.
- The backend has a 30-second streaming timeout and 60-second JSON timeout.

### Chat messages are cut off
- The backend uses `max_tokens=2048` for streaming and `max_tokens=4096` for job-match JSON responses.
