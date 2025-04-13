import { z } from "zod";

class TicketValidator {
  #schema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1).max(255),
    description: z.string().min(1).max(65535),
    status: z.enum(["open", "in_progress", "closed"]),
    userId: z.coerce.number(),
  });

  findById(data) {
    return this.#schema.pick({ id: true, userId: true }).required().parse(data);
  }

  findByUserId(data) {
    return this.#schema.pick({ userId: true }).required().parse(data);
  }

  create(data) {
    return this.#schema.omit({ id: true }).parse(data);
  }

  update(data) {
    return this.#schema.required().parse(data);
  }
}

export { TicketValidator };
