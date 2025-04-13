import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();
const ticketController = new TicketController();

router.get("/", authorize(), ticketController.index);
router.get("/:id", authorize(), ticketController.show);
router.post("/", authorize(), ticketController.store);
router.put("/:id", authorize(), ticketController.update);

export { router as ticketRoutes };
