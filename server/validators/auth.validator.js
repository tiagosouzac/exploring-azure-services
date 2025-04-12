import { z } from "zod";

class AuthValidator {
  #schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  handle(data) {
    return this.#schema.parse(data);
  }
}

export { AuthValidator };
