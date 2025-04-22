import fs from "fs/promises";
import path from "path";
import { createError } from "../middlewares/error.middleware";
import { prisma } from "../app";
import { Status } from "@prisma/client";

export interface CreateMessageDTO {
  content: string;
  userId: string;
  ticketId: string;
  attachments?: Express.Multer.File[];
}

export class MessageService {
  async createMessage(data: CreateMessageDTO) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: data.ticketId },
    });

    if (!ticket) {
      throw createError("Ticket not found", 404);
    }

    if (ticket.status === Status.CONCLUIDO) {
      throw createError("Cannot add messages to a closed ticket", 400);
    }

    const message = await prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        ticketId: data.ticketId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (data.attachments && data.attachments.length > 0) {
      const attachmentPromises = data.attachments.map(async (file) => {
        return prisma.attachment.create({
          data: {
            filename: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            messageId: message.id,
          },
        });
      });

      const attachments = await Promise.all(attachmentPromises);
      (message as any).attachments = attachments;
    } else {
      (message as any).attachments = [];
    }

    return message;
  }

  async getMessagesByTicketId(ticketId: string) {
    const messages = await prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        attachments: true,
      },
    });

    return messages;
  }

  async deleteMessage(messageId: string, userId: string, role: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { attachments: true },
    });

    if (!message) {
      throw createError("Message not found", 404);
    }

    if (message.userId !== userId && role !== "ATENDENTE") {
      throw createError(
        "Access denied: you can only delete your own messages",
        403
      );
    }

    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        try {
          await fs.unlink(attachment.path);
        } catch (error) {
          console.error("Error deleting attachment file:", error);
        }
      }

      await prisma.attachment.deleteMany({
        where: { messageId },
      });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return { success: true };
  }
}
