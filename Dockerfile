# Single-service Railway deploy: API + React UI on one URL

FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app/frontend

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ENV VITE_API_BASE_URL=/api/v1
ENV VITE_APP_NAME="TaskFlow Manager"
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build:railway

FROM node:20-bookworm-slim AS backend-build

WORKDIR /app/backend

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ ./

RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 5000

CMD ["node", "dist/server.js"]
