import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { exceptionHandler } from "./middlewares/exception-handler.js";
import { userRoutes } from "./routes/user.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { ticketRoutes } from "./routes/ticket.routes.js";

dotenv.config({ path: ".env.development" });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tickets", ticketRoutes);

// Exception Handler
app.use(exceptionHandler);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}

export { app };
