import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Middlewares
import { exceptionHandler } from "./middlewares/exception-handler.js";

// Routes
import { userRoutes } from "./routes/user.routes.js";

dotenv.config({ path: ".env.development" });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use(exceptionHandler);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}

export { app };
