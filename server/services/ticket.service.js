import { NotFoundException } from "../exceptions/not-found.js";
import { Ticket } from "../models/ticket.js";
import { TicketRepository } from "../repositories/ticket.repository.js";

class TicketService {
  #repository = new TicketRepository();

  async findByUserId(userId) {
    const tickets = await this.#repository.findByUserId(userId);
    return tickets?.map((ticket) => new Ticket(ticket, ticket.id)) ?? [];
  }

  async findById(id, userId) {
    const ticket = await this.#repository.findById(id, userId);

    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }

    return new Ticket(ticket, ticket.id);
  }

  async save(ticket) {
    ticket = await this.#repository.save(ticket);
    return new Ticket(ticket, ticket.id);
  }

  async update(ticket) {
    const existingTicket = await this.#repository.findById(
      ticket.id,
      ticket.userId
    );

    if (!existingTicket) {
      throw new NotFoundException("Ticket not found");
    }

    ticket = await this.#repository.save(ticket);
    return new Ticket(ticket, ticket.id);
  }
}

export { TicketService };
