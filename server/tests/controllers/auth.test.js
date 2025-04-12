import request from "supertest";
import { app } from "../../index.js";
import { AuthService } from "../../services/auth.service.js";
import { NotFoundException } from "../../exceptions/not-found.js";
import { UnauthorizedException } from "../../exceptions/unauthorized.js";

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

vi.mock("../../services/auth.service.js", () => {
  const AuthServiceMock = vi.fn();

  AuthServiceMock.prototype.login = vi.fn(() => ({
    user,
    token: "jwt_token",
  }));

  return { AuthService: AuthServiceMock };
});

describe("[Controller] Auth", () => {
  it("should return 400 when validation to authenticate the user fails", async () => {
    const response = await request(app).post("/api/v1/auth").send({});

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe(
      "Validation failed. Please check the provided data."
    );
    expect(Array.isArray(response.body.errors)).toBe(true);
    response.body.errors.forEach((error) => {
      expect(error).toHaveProperty("field");
      expect(error).toHaveProperty("message");
    });
  });

  it("should return 404 when user is not found", async () => {
    AuthService.prototype.login.mockImplementationOnce(() => {
      throw new NotFoundException("User not found");
    });

    const response = await request(app).post("/api/v1/auth").send(payload);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User not found");
  });

  it("should return 401 when credentials are invalid", async () => {
    AuthService.prototype.login.mockImplementationOnce(() => {
      throw new UnauthorizedException("Invalid credentials");
    });

    const response = await request(app).post("/api/v1/auth").send(payload);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return a token and user when credentials are valid", async () => {
    const response = await request(app).post("/api/v1/auth").send(payload);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("User authenticated successfully");
    expect(response.body.data).toEqual({
      user: { ...user, password: undefined },
      token: "jwt_token",
    });
  });
});
