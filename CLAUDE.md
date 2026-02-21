# Task Management Backend

Build a task management API with the following features:

## Database Schema (Prisma)

Add a `Task` model to `prisma/schema.prisma`:

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("todo") // todo, in-progress, done
  priority    String   @default("medium") // low, medium, high
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Add `tasks Task[]` to the User model.

## API Routes

Create `/src/routes/tasks.ts` with:

- `GET /tasks` - List all tasks for authenticated user (with optional filters: status, priority)
- `GET /tasks/:id` - Get single task
- `POST /tasks` - Create new task (validate: title required, status/priority from enum)
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

All routes should require authentication. Validate that tasks belong to the authenticated user.

## Steps

1. Update Prisma schema
2. Run migration: `npm run db:migrate -- --name add_tasks`
3. Create task routes with proper validation (Zod)
4. Mount routes in `src/index.ts` after auth middleware
5. Test locally with `npm run dev`
6. Commit and push when ready

Keep it simple. Don't over-engineer.
