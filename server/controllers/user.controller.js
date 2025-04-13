import { UserValidator } from "../validators/user.validator.js";
import { UserDto } from "../dtos/user.dto.js";
import { UserService } from "../services/user.service.js";

class UserController {
  #validator = new UserValidator();
  #service = new UserService();

  constructor() {
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
  }

  async show(request, response) {
    const result = this.#validator.findById(request.query);
    const user = await this.#service.findById(result.id);

    response.json({
      status: "success",
      message: "User found",
      data: new UserDto(user),
    });
  }

  async store(request, response) {
    const result = this.#validator.create(request.body);
    const user = await this.#service.save(result);

    response.status(201).json({
      status: "success",
      message: "User created successfully",
      data: new UserDto(user),
    });
  }
}

export { UserController };
