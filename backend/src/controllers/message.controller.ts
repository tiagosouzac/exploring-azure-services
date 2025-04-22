import { Request, Response, NextFunction } from "express";
import { MessageService } from "../services/message.service";
import { MulterOutFile } from "multer-azure-blob-storage";

export class MessageController {
  private messageService = new MessageService();

  createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      const files = req.files as MulterOutFile[];

      const message = await this.messageService.createMessage({
        content: req.body.content,
        userId: req.user.id,
        ticketId: req.body.ticketId,
        attachments: files,
      });

      res.status(201).json({
        status: "success",
        message: "Message sent successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  getMessagesByTicketId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      const ticketId = req.params.ticketId;

      const messages = await this.messageService.getMessagesByTicketId(
        ticketId
      );

      res.status(200).json({
        status: "success",
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      const messageId = req.params.id;

      const result = await this.messageService.deleteMessage(
        messageId,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        status: "success",
        message: "Message deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
