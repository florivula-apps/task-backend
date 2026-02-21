import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const router = Router();

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional(),
});

// GET /tasks - List all tasks for authenticated user
router.get("/", async (req, res, next) => {
  try {
    const { status, priority } = req.query;

    const where: any = { userId: req.user!.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Get single task
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create new task
router.post("/", async (req, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: req.user!.id,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
});

// PUT /tasks/:id - Update task
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = updateTaskSchema.parse(req.body);

    // Check if task belongs to user
    const existing = await prisma.task.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
});

// DELETE /tasks/:id - Delete task
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Check if task belongs to user
    const existing = await prisma.task.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
