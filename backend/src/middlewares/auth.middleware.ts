import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { createError } from "./error.middleware";
import { Role } from "@prisma/client";
import { prisma } from "../app";

interface TokenPayload {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createError("Authentication token not provided", 401);
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw createError("Invalid token format", 401);
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

      const userExists = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!userExists) {
        throw createError("User not found", 401);
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError("Invalid or expired token", 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const isAttendant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    if (req.user.role !== Role.ATENDENTE) {
      throw createError("Access restricted to attendants", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isOwnerOrAttendant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    if (req.user.role === Role.ATENDENTE) {
      return next();
    }

    const resourceUserId = req.params.userId || req.body.userId;

    if (resourceUserId && resourceUserId !== req.user.id) {
      throw createError(
        "Access denied: you can only access your own resources",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
