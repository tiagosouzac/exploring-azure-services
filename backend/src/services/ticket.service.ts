import { Status } from "@prisma/client";
import { prisma } from "../app";
import { createError } from "../middlewares/error.middleware";

export interface CreateTicketDTO {
  title: string;
  description: string;
  userId: string;
}

export interface UpdateTicketStatusDTO {
  status: Status;
}

export class TicketService {
  async createTicket(data: CreateTicketDTO) {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return ticket;
  }

  async listTickets(userId: string, role: string, status?: Status) {
    const filter: any = {};

    if (role === "CLIENTE") {
      filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    const tickets = await prisma.ticket.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            content: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return tickets;
  }

  async getTicketById(ticketId: string, userId: string, role: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
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
        },
      },
    });

    if (!ticket) {
      throw createError("Ticket not found", 404);
    }

    if (role === "CLIENTE" && ticket.userId !== userId) {
      throw createError(
        "Access denied: you do not have permission to view this ticket",
        403
      );
    }

    return ticket;
  }

  async updateTicketStatus(
    ticketId: string,
    { status }: UpdateTicketStatusDTO
  ) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw createError("Ticket not found", 404);
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(status === Status.CONCLUIDO ? { closedAt: new Date() } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updatedTicket;
  }
}
