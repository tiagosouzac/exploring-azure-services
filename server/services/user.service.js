import { User } from "../models/user";
import { UserRepository } from "../repositories/user.repository.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ConflictException } from "../exceptions/conflict.js";

class UserService {
  #repository = new UserRepository();

  async findById(id) {
    const user = await this.#repository.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return new User(user, user.id);
  }

  async save(user) {
    const alreadyExists = await this.#repository.findByEmail(user.email);

    if (alreadyExists) {
      throw new ConflictException("User already exists with this email");
    }

    user = await this.#repository.save(user);

    return new User(user, user.id);
  }
}

export { UserService };
