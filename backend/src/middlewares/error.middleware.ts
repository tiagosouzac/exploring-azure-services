import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode: number;
}

export function createError(message: string, statusCode = 500): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    status: "error",
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
