# Backend Template

Node.js + Express + Prisma + PostgreSQL starter template for rapid app creation.

## What's Included

- **Express** REST API server with TypeScript
- **Prisma** ORM with PostgreSQL
- **Authentication** (JWT) - login/register already implemented
- **Docker** setup with docker-compose (API + PostgreSQL)
- **Middleware**: auth, error handling, request validation (Zod)

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run migrations
npm run db:migrate

# Development
npm run dev

# Production (Docker)
docker compose up -d
```

## Project Structure

```
src/
├── index.ts          # Express app entry point
├── routes/           # API route handlers
│   └── auth.ts       # Login/register routes (example)
├── middleware/       # Express middleware
│   ├── auth.ts       # JWT authentication
│   ├── errorHandler.ts
│   └── validate.ts   # Zod request validation
└── lib/
    └── prisma.ts     # Prisma client singleton

prisma/
└── schema.prisma     # Database schema
```

## Adding New Features

### 1. Add a new model to `prisma/schema.prisma`
```prisma
model Item {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
```

### 2. Run migration
```bash
npm run db:migrate -- --name add_items
```

### 3. Create route handler
```typescript
// src/routes/items.ts
import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});

export default router;
```

### 4. Mount in `src/index.ts`
```typescript
import itemsRouter from "./routes/items";
// After authenticate middleware:
app.use("/items", itemsRouter);
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
JWT_SECRET=your-secret-key
```

## Scripts

- `npm run dev` - Start with nodemon (auto-reload)
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled code
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes (dev only)

## Deployment

Included `Dockerfile` and `docker-compose.yml` are ready for production deployment.

```bash
docker compose up -d
```

Access: `http://localhost:3000/health`
