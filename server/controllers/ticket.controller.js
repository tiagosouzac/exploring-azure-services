import { TicketValidator } from "../validators/ticket.validator.js";
import { TicketService } from "../services/ticket.service.js";
import { TicketDto } from "../dtos/ticket.dto.js";

class TicketController {
  #validator = new TicketValidator();
  #service = new TicketService();

  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
  }

  async index(request, response) {
    const result = this.#validator.findByUserId({ userId: request.user.id });
    const tickets = await this.#service.findByUserId(result.userId);

    response.json({
      status: "success",
      message: tickets.length ? "Tickets found" : "No tickets found",
      data: tickets.map((ticket) => new TicketDto(ticket)),
    });
  }

  async show(request, response) {
    const result = this.#validator.findById({
      ...request.params,
      userId: request.user.id,
    });

    const ticket = await this.#service.findById(result.id, result.userId);

    response.json({
      status: "success",
      message: "Ticket found",
      data: new TicketDto(ticket),
    });
  }

  async store(request, response) {
    const result = this.#validator.create({
      ...request.body,
      status: "open",
      userId: request.user.id,
    });

    const ticket = await this.#service.save(result);

    response.status(201).json({
      status: "success",
      message: "Ticket created successfully",
      data: new TicketDto(ticket),
    });
  }

  async update(request, response) {
    const result = this.#validator.update({
      ...request.body,
      ...request.params,
      userId: request.user.id,
    });

    const ticket = await this.#service.update(result);

    response.json({
      status: "success",
      message: "Ticket updated successfully",
      data: new TicketDto(ticket),
    });
  }
}

export { TicketController };
