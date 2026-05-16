# Deploy TaskFlow on Railway (recommended: one service)

The repo includes a **root `Dockerfile`** that builds the React UI and Express API together. You get **one URL** for everything (simpler CORS and cookies).

## What you need

1. [Railway](https://railway.app) account (GitHub login)
2. [MongoDB Atlas](https://cloud.mongodb.com) free cluster
3. Code on GitHub: `adarshraghu45/Task_flow` branch `main`

---

## Part A — MongoDB Atlas (5–10 min)

1. Sign up at https://cloud.mongodb.com
2. **Build Database** → **M0 FREE** → create
3. **Database Access** → **Add User** → username + password (save both)
4. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. **Database** → **Connect** → **Drivers** → copy connection string
6. Replace `<password>` in the URI; encode special chars (`@` → `%40`)
7. Add database name before `?`, e.g. `...mongodb.net/taskflow?retryWrites=...`

Save as **MONGODB_URI**.

---

## Part B — Railway (one service)

### B1. New project

1. https://railway.app/new
2. **Deploy from GitHub repo** → authorize → select **Task_flow**
3. **Do not** set a root directory — leave repo root (uses `/Dockerfile`)

### B2. Environment variables

Open the service → **Variables** → **RAW Editor** → paste (edit values):

```env
NODE_ENV=production
MONGODB_URI=your-atlas-connection-string
JWT_SECRET=your-long-random-secret-at-least-32-chars
JWT_REFRESH_SECRET=another-long-random-secret
COOKIE_SECURE=true
REDIS_ENABLED=false
ADMIN_EMAIL=admin@taskflow.com
ADMIN_PASSWORD=YourStrongPassword123
ADMIN_NAME=TaskFlow Admin
```

See `railway.env.example` in the repo.  
**Do not set `PORT`** — Railway sets it automatically.

`FRONTEND_URL` and `CORS_ORIGIN` are **optional** — they auto-fill from your Railway public domain.

### B3. Public URL

1. **Settings** → **Networking** → **Generate Domain**
2. Wait for deploy to finish (green) — first build ~3–5 min

### B4. Test

| URL | Expected |
|-----|----------|
| `https://YOUR-DOMAIN.up.railway.app` | TaskFlow login page |
| `https://YOUR-DOMAIN.up.railway.app/api/v1/health` | JSON `healthy` |

Register → create project → create task.

---

## Part C — Updates

Push to `main` on GitHub → Railway redeploys automatically.

---

## Alternative: two separate services

Use `backend/` and `frontend/` each as its own Railway service with their own `Dockerfile`s. Set `VITE_API_BASE_URL` and `CORS_ORIGIN` manually. More setup — only use if you need split scaling.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build failed | Open **Deployments** → **View logs** |
| Crash / 502 | Check `MONGODB_URI`; Atlas must allow `0.0.0.0/0` |
| Invalid env | All required vars in B2 must be set |
| Blank page | Redeploy; check logs for `public/index.html` |
| CORS | With one service, CORS is same-origin — usually N/A |

---

## CLI deploy (optional)

```powershell
npm install -g @railway/cli
railway login
cd Task_FLow
railway init
# Set variables in dashboard, then:
railway up
```

Or run: `.\scripts\deploy-railway.ps1`
