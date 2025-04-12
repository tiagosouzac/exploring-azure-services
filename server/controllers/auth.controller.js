import { UserDto } from "../dtos/user.dto.js";
import { AuthService } from "../services/auth.service.js";
import { AuthValidator } from "../validators/auth.validator.js";

class AuthController {
  #validator = new AuthValidator();
  #service = new AuthService();

  constructor() {
    this.handle = this.handle.bind(this);
  }

  async handle(request, response) {
    const result = this.#validator.handle(request.body);

    const authenticatedUser = await this.#service.login(
      result.email,
      result.password
    );

    response.json({
      status: "success",
      message: "User authenticated successfully",
      data: {
        user: new UserDto(authenticatedUser.user),
        token: authenticatedUser.token,
      },
    });
  }
}

export { AuthController };
