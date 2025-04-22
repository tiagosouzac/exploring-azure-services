import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import config from "./config";
import { errorHandler } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import ticketRoutes from "./routes/ticket.routes";
import messageRoutes from "./routes/message.routes";

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.resolve(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    version: config.version,
    environment: config.environment,
  });
});

export default app;
