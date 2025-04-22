import { Router } from "express";
import { authenticate, isAttendant } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get("/", isAttendant, userController.getAllUsers);
router.get("/:id", userController.getUserById);

export default router;
