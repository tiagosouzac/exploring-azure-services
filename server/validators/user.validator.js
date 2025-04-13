import { z } from "zod";

class UserValidator {
  #schema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["customer", "attendant"], "Invalid role").default("customer"),
  });

  create(data) {
    return this.#schema.omit({ id: true }).parse(data);
  }

  findById(data) {
    return this.#schema.pick({ id: true }).required().parse(data);
  }
}

export { UserValidator };
