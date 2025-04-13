import { NotFoundException } from "../../exceptions/not-found.js";
import { Ticket } from "../../models/ticket.js";
import { TicketRepository } from "../../repositories/ticket.repository";
import { TicketService } from "../../services/ticket.service.js";

const ticket = new Ticket(
  {
    title: "Test Ticket",
    description: "Test Description",
    status: "open",
    userId: 1,
  },
  1
);

vi.mock("../../repositories/ticket.repository.js", () => {
  const TicketRepositoryMock = vi.fn();
  TicketRepositoryMock.prototype.findByUserId = vi.fn(() => [ticket]);
  TicketRepositoryMock.prototype.findById = vi.fn(() => ticket);
  TicketRepositoryMock.prototype.save = vi.fn(() => ticket);
  return { TicketRepository: TicketRepositoryMock };
});

const ticketService = new TicketService();
const ticketRepository = new TicketRepository();

describe("[Service] Tickets", () => {
  it("should find tickets by user ID", async () => {
    const tickets = await ticketService.findByUserId(1);

    expect(tickets).toEqual([ticket]);
    expect(ticketRepository.findByUserId).toHaveBeenCalledWith(1);
  });

  it("should return an empty array if no tickets are found", async () => {
    ticketRepository.findByUserId.mockReturnValueOnce([]);

    const tickets = await ticketService.findByUserId(1);

    expect(tickets).toEqual([]);
    expect(ticketRepository.findByUserId).toHaveBeenCalledWith(1);
  });

  it("should find a ticket by ID", async () => {
    const foundTicket = await ticketService.findById(1, 1);

    expect(foundTicket).toEqual(ticket);
    expect(ticketRepository.findById).toHaveBeenCalledWith(1, 1);
  });

  it("should throw an NotFoundException if the ticket is not found", async () => {
    ticketRepository.findById.mockReturnValueOnce(null);

    await expect(ticketService.findById(1, 1)).rejects.toThrow(
      NotFoundException
    );
    expect(ticketRepository.findById).toHaveBeenCalledWith(1, 1);
  });

  it("should save a ticket", async () => {
    const savedTicket = await ticketService.save(ticket);

    expect(savedTicket).toEqual(ticket);
    expect(ticketRepository.save).toHaveBeenCalledWith(ticket);
  });

  it("should update a ticket", async () => {
    const expected = {
      ...ticket,
      title: "Updated Ticket",
      description: "Updated Description",
    };

    ticketRepository.save.mockReturnValueOnce({
      ...ticket,
      title: "Updated Ticket",
      description: "Updated Description",
    });

    const updatedTicket = await ticketService.update(expected);

    expect(updatedTicket).toEqual(expected);
    expect(ticketRepository.save).toHaveBeenCalledWith(expected);
  });
});
