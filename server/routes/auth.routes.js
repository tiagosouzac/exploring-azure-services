import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post("/", authController.handle);

export { router as authRoutes };
