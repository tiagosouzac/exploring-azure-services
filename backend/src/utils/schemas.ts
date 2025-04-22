import { z } from "zod";
import { Role, Status } from "@prisma/client";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    role: z
      .enum([Role.CLIENTE, Role.ATENDENTE])
      .optional()
      .default(Role.CLIENTE),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const createTicketSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(100, { message: "Title must be at most 100 characters long" }),
    description: z
      .string({ required_error: "Description is required" })
      .min(10, { message: "Description must be at least 10 characters long" }),
  }),
});

export const updateTicketStatusSchema = z.object({
  body: z.object({
    status: z.enum([Status.ABERTO, Status.CONCLUIDO], {
      required_error: "Status is required",
      invalid_type_error: "Status must be either ABERTO or CONCLUIDO",
    }),
  }),
});

export const createMessageSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    ticketId: z.string({ required_error: "Ticket ID is required" }),
  }),
});

export const paramsWithIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "ID is required" }),
  }),
});

export const ticketIdParamSchema = z.object({
  params: z.object({
    ticketId: z.string({ required_error: "Ticket ID is required" }),
  }),
});
