import request from "supertest";
import { app } from "../../index.js";
import { TicketService } from "../../services/ticket.service.js";
import { Ticket } from "../../models/ticket";
import { NotFoundException } from "../../exceptions/not-found.js";

const ticket = new Ticket(
  {
    title: "Test Ticket",
    description: "Test Description",
    status: "open",
    userId: 1,
  },
  1
);

const updatedTicket = new Ticket(
  {
    ...ticket,
    title: "Updated Ticket",
    description: "Updated Description",
  },
  1
);

const user = {
  id: 1,
  name: "John Doe",
  email: "john.doe@mail.com",
  password: "hashed_password",
  role: "customer",
};

vi.mock("../../middlewares/authorize.js", () => {
  return {
    authorize: () => (req, _, next) => {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    },
  };
});

vi.mock("../../services/ticket.service.js", () => {
  const TicketServiceMock = vi.fn();
  TicketServiceMock.prototype.findByUserId = vi.fn(() => [ticket]);
  TicketServiceMock.prototype.findById = vi.fn(() => ticket);
  TicketServiceMock.prototype.save = vi.fn(() => ticket);
  TicketServiceMock.prototype.update = vi.fn(() => updatedTicket);

  return { TicketService: TicketServiceMock };
});

const ticketService = new TicketService();

describe("[Controller] Tickets", () => {
  it("should return a list of tickets", async () => {
    const response = await request(app).get("/api/v1/tickets");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Tickets found",
      data: [ticket],
    });
    expect(ticketService.findByUserId).toHaveBeenCalledWith(1);
  });

  it("should return a message and an empty array when no ticket is found", async () => {
    ticketService.findByUserId.mockReturnValueOnce([]);

    const response = await request(app).get("/api/v1/tickets");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "No tickets found",
      data: [],
    });
  });

  it("should return a ticket by ID", async () => {
    const response = await request(app).get("/api/v1/tickets/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Ticket found",
      data: ticket,
    });
    expect(ticketService.findById).toHaveBeenCalledWith(1, 1);
  });

  it("should return a 404 error when ticket is not found", async () => {
    ticketService.findById.mockImplementationOnce(() => {
      throw new NotFoundException("Ticket not found");
    });

    const response = await request(app).get("/api/v1/tickets/999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Ticket not found",
    });
    expect(ticketService.findById).toHaveBeenCalledWith(999, 1);
  });

  it("should create a new ticket", async () => {
    const response = await request(app).post("/api/v1/tickets").send({
      title: "New Ticket",
      description: "New Description",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      message: "Ticket created successfully",
      data: ticket,
    });
    expect(ticketService.save).toHaveBeenCalledWith({
      title: "New Ticket",
      description: "New Description",
      status: "open",
      userId: 1,
    });
  });

  it("should return a 400 error when validation fails", async () => {
    const response = await request(app).post("/api/v1/tickets").send({
      title: "",
      description: "New Description",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe(
      "Validation failed. Please check the provided data."
    );
    expect(Array.isArray(response.body.errors)).toBe(true);
    response.body.errors.forEach((error) => {
      expect(error).toHaveProperty("field");
      expect(error).toHaveProperty("message");
    });
  });

  it("should update an existing ticket", async () => {
    const response = await request(app)
      .put("/api/v1/tickets/1")
      .send(updatedTicket);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
    expect(ticketService.update).toHaveBeenCalledWith(updatedTicket);
  });
});
