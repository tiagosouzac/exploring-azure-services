import { UserRepository } from "../../repositories/user.repository";
import { AuthService } from "../../services/auth.service";
import { HashService } from "../../services/hash.service";
import { JWTService } from "../../services/jwt.service";
import { NotFoundException } from "../../exceptions/not-found";
import { UnauthorizedException } from "../../exceptions/unauthorized";

const payload = {
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

vi.mock("../../services/jwt.service.js", () => {
  const JWTServiceMock = vi.fn();
  JWTServiceMock.prototype.generateToken = vi.fn(() => "jwt_token");

  return { JWTService: JWTServiceMock };
});

const authService = new AuthService();
const hashService = new HashService();
const jwtService = new JWTService();

describe("[Service] Auth", () => {
  it("should throw NotFoundException when user is not found", async () => {
    UserRepository.prototype.findByEmail.mockReturnValueOnce(null);

    await expect(
      authService.login(payload.email, payload.password)
    ).rejects.toThrow(NotFoundException);
    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(
      payload.email
    );
  });

  it("should throw UnauthorizedException when password is invalid", async () => {
    HashService.prototype.comparePassword.mockReturnValueOnce(false);

    await expect(
      authService.login(payload.email, payload.password)
    ).rejects.toThrow(UnauthorizedException);
    expect(hashService.comparePassword).toHaveBeenCalledWith(
      payload.password,
      user.password
    );
  });

  it("should return a user and token when credentials are valid", async () => {
    const result = await authService.login(payload.email, payload.password);

    expect(result).toEqual({
      user: { ...user, password: undefined },
      token: "jwt_token",
    });
    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(
      payload.email
    );
    expect(hashService.comparePassword).toHaveBeenCalledWith(
      payload.password,
      user.password
    );
    expect(jwtService.generateToken).toHaveBeenCalledWith(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION ?? "1h" }
    );
  });

  it("should not return the password in the user object", async () => {
    const result = await authService.login(payload.email, payload.password);

    expect(result.user).not.toHaveProperty("password");
  });
});
