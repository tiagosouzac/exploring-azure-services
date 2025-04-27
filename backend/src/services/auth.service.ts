import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import config from "../config";
import { createError } from "../middlewares/error.middleware";
import { Role } from "../utils/types";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(userData: RegisterDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw createError("Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || Role.CLIENTE,
      },
    });

    const token = this.generateToken(user.id, user.role as Role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login({ email, password }: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createError("Invalid credentials", 401);
    }

    const token = this.generateToken(user.id, user.role as Role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  private generateToken(userId: string, role: Role): string {
    return jwt.sign(
      {
        id: userId,
        role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }
}
