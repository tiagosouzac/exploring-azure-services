import { User } from "../../models/user.js";
import { UserService } from "../../services/user.service.js";
import { HashService } from "../../services/hash.service.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { NotFoundException } from "../../exceptions/not-found.js";
import { ConflictException } from "../../exceptions/conflict.js";

const payload = {
  name: "John Doe",
  email: "john.doe@mail.com",
  password: "raw_password",
};

const user = {
  id: 1,
  name: "John Doe",
  email: "john.doe@mail.com",
  password: "hashed_password",
  role: "customer",
};

vi.mock("../../repositories/user.repository.js", () => {
  const UserRepositoryMock = vi.fn();
  UserRepositoryMock.prototype.findById = vi.fn(() => user);
  UserRepositoryMock.prototype.findByEmail = vi.fn(() => user);
  UserRepositoryMock.prototype.save = vi.fn(() => user);

  return { UserRepository: UserRepositoryMock };
});

vi.mock("../../services/hash.service.js", () => {
  const HashServiceMock = vi.fn();
  HashServiceMock.prototype.hashPassword = vi.fn(() => "hashed_password");
  HashServiceMock.prototype.comparePassword = vi.fn(() => true);

  return { HashService: HashServiceMock };
});

const userService = new UserService();
const hashService = new HashService();

describe("[Service] User", () => {
  it("should return a user by id", async () => {
    await expect(userService.findById(1)).resolves.toEqual(user);
    expect(UserRepository.prototype.findById).toHaveBeenCalledWith(1);
  });

  it("should throw NotFoundException when user is not found", async () => {
    UserRepository.prototype.findById.mockReturnValueOnce(null);

    await expect(userService.findById(999)).rejects.toThrow(NotFoundException);
    expect(UserRepository.prototype.findById).toHaveBeenCalledWith(999);
  });

  it("should save a user", async () => {
    UserRepository.prototype.findByEmail.mockReturnValueOnce(null);

    const newUser = new User(payload);
    const result = await userService.save(newUser);

    expect(result).toEqual(user);
    expect(UserRepository.prototype.save).toHaveBeenCalledWith(newUser);
  });

  it("should hash the password before saving", async () => {
    UserRepository.prototype.findByEmail.mockReturnValueOnce(null);

    await userService.save(new User(payload));

    expect(hashService.hashPassword).toHaveBeenCalledWith(payload.password);
  });

  it("should throw ConflictException when user already exists", async () => {
    await expect(userService.save(new User(payload))).rejects.toThrow(
      ConflictException
    );
    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(
      user.email
    );
  });
});
