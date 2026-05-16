# TaskFlow Manager

A modern full-stack SaaS application for task and workflow management with **real-time updates** via Socket.IO and **MongoDB Atlas**.

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React, TypeScript, Vite, TailwindCSS, Redux Toolkit, React Query, React Router, Framer Motion, Socket.IO Client |
| Backend  | Node.js, Express, MongoDB Atlas, Mongoose, JWT, Socket.IO |
| Optional | Redis + BullMQ (disabled by default — no Docker required) |

## Quick Start (no Docker)

### 1. Install everything (once)

```bash
cd Task_FLow
npm run install:all
```

### 2. Configure MongoDB

Edit `backend/.env` — your Atlas URI should already be set:

```
MONGODB_URI=mongodb+srv://...
REDIS_ENABLED=false
```

In [MongoDB Atlas](https://cloud.mongodb.com), add your IP under **Network Access**.

### 3. Run frontend + backend together

```bash
npm run dev
```

| Service  | URL |
| -------- | --- |
| Website  | http://localhost:5173 |
| API      | http://localhost:5000/api/v1 |
| Health   | http://localhost:5000/api/v1/health |

### 4. Use the app

1. Open http://localhost:5173  
2. **Register** or **Sign in**  
3. Go to **Tasks** — create, update status, or delete tasks  
4. Dashboard stats update **in real time** via WebSocket (no page refresh)

## Real-time architecture

```
Browser (React Query)  ←—— Socket.IO ——→  Express API
        ↓                                      ↓
   Instant UI updates              MongoDB Atlas (tasks)
```

Events: `task:created`, `task:updated`, `task:deleted`, `stats:updated`

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start backend + frontend together |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |
| `npm run build` | Production build for both |

## Environment

- `backend/.env` — MongoDB, JWT, `REDIS_ENABLED=false` (default)
- `frontend/.env` — API and Socket URLs

## License

MIT
