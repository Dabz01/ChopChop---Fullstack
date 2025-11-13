# ChopChop Fullstack (Frontend + Backend + PostgreSQL via Docker)

This bundle contains:

- `frontend/` – Next.js + Tailwind customer app
- `backend/` – NestJS + Prisma API
- `docker-compose.yml` – runs PostgreSQL + backend in containers

## Requirements

- Node.js 18+
- npm
- Docker Desktop (for PostgreSQL + backend)

## Quick Start

### 1. Start backend + database

In the project root:

```bash
docker compose up --build
```

This will:
- start PostgreSQL on port 5432 (inside Docker)
- run Prisma migrations
- start the NestJS backend on port 4000

### 2. Start frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

The frontend expects the backend at http://localhost:4000/api/v1
