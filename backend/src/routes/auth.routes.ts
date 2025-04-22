import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { registerSchema, loginSchema } from "../utils/schemas";
import { authenticate } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/check", authenticate, authController.checkAuth);

export default router;
