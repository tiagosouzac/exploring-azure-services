import { HashService } from "./hash.service.js";
import { JWTService } from "./jwt.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

class AuthService {
  #hashService = new HashService();
  #jwtService = new JWTService();
  #repository = new UserRepository();

  async login(email, password) {
    const user = await this.#repository.findByEmail(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await this.#hashService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const { password: _, ...secureUserAttributes } = user;

    const token = this.#jwtService.generateToken(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION ?? "1h" }
    );

    return {
      user: secureUserAttributes,
      token,
    };
  }
}

export { AuthService };
