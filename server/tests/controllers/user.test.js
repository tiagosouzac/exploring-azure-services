import { expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../index.js";
import { UserService } from "../../services/user.service.js";
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

const expected = {
  id: 1,
  name: "John Doe",
  email: "john.doe@mail.com",
  role: "customer",
};

vi.mock("../../services/user.service.js", () => {
  const UserServiceMock = vi.fn();
  UserServiceMock.prototype.findById = vi.fn(() => user);
  UserServiceMock.prototype.save = vi.fn(() => user);

  return { UserService: UserServiceMock };
});

describe("[Controller] Users", async () => {
  it("should return a user by id", async () => {
    const response = await request(app).get("/api/v1/users").query({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("User found");
    expect(response.body.data).toEqual(expected);
  });

  it("should not return the user password when getting user details", async () => {
    const response = await request(app).get("/api/v1/users").query({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("role");
    expect(response.body.data.password).toBeUndefined();
  });

  it("should return a 404 error when user is not found", async () => {
    UserService.prototype.findById.mockImplementationOnce(() => {
      throw new NotFoundException("User not found");
    });

    const response = await request(app).get("/api/v1/users").query({ id: 1 });

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User not found");
    expect(response.body.data).toBeUndefined();
  });

  it("should create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.data).toEqual(expected);
  });

  it("should not return the user password when creating a new user", async () => {
    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("role");
    expect(response.body.data.password).toBeUndefined();
  });

  it("should return a 409 error when user already exists", async () => {
    UserService.prototype.save.mockImplementationOnce(() => {
      throw new ConflictException("User already exists with this email");
    });

    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(409);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User already exists with this email");
    expect(response.body.data).toBeUndefined();
  });
});
