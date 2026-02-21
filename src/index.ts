import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import { authenticate } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Public routes
app.use("/auth", authRouter);

// Protected routes (add your routes below)
app.use(authenticate);
// Example: app.use("/items", itemsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
