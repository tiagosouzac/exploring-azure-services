import { Router } from "express";
import { authenticate, isAttendant } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  createTicketSchema,
  paramsWithIdSchema,
  updateTicketStatusSchema,
} from "../utils/schemas";
import { TicketController } from "../controllers/ticket.controller";

const router = Router();
const ticketController = new TicketController();

router.use(authenticate);

router.post("/", validate(createTicketSchema), ticketController.createTicket);
router.get("/", ticketController.listTickets);
router.get(
  "/:id",
  validate(paramsWithIdSchema),
  ticketController.getTicketById
);
router.patch(
  "/:id/status",
  validate(paramsWithIdSchema),
  validate(updateTicketStatusSchema),
  isAttendant,
  ticketController.updateTicketStatus
);

export default router;
