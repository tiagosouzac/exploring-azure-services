import { Request, Response, NextFunction } from "express";
import { Status } from "@prisma/client";
import { TicketService } from "../services/ticket.service";

export class TicketController {
  private ticketService = new TicketService();

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      const ticket = await this.ticketService.createTicket({
        title: req.body.title,
        description: req.body.description,
        userId: req.user.id,
      });

      res.status(201).json({
        status: "success",
        message: "Ticket created successfully",
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  };

  listTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      const status = req.query.status as Status | undefined;

      const tickets = await this.ticketService.listTickets(
        req.user.id,
        req.user.role,
        status
      );

      res.status(200).json({
        status: "success",
        message: "Tickets list retrieved successfully",
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  };

  getTicketById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      const ticketId = req.params.id;

      const ticket = await this.ticketService.getTicketById(
        ticketId,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        status: "success",
        message: "Ticket retrieved successfully",
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTicketStatus = async (
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

      const ticketId = req.params.id;

      const updatedTicket = await this.ticketService.updateTicketStatus(
        ticketId,
        { status: req.body.status }
      );

      res.status(200).json({
        status: "success",
        message: `Ticket marked as ${req.body.status}`,
        data: updatedTicket,
      });
    } catch (error) {
      next(error);
    }
  };
}
