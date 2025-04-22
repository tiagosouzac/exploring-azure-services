import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  createMessageSchema,
  paramsWithIdSchema,
  ticketIdParamSchema,
} from "../utils/schemas";
import { upload, handleUploadError } from "../middlewares/upload.middleware";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const messageController = new MessageController();

router.use(authenticate);

router.post(
  "/",
  upload.array("attachments", 5),
  handleUploadError,
  validate(createMessageSchema),
  messageController.createMessage
);

router.get(
  "/ticket/:ticketId",
  validate(ticketIdParamSchema),
  messageController.getMessagesByTicketId
);

router.delete(
  "/:id",
  validate(paramsWithIdSchema),
  messageController.deleteMessage
);

export default router;
