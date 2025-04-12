import { NotFoundException } from "../exceptions/not-found.js";
import { ConflictException } from "../exceptions/conflict.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ZodError } from "zod";

function exceptionHandler(error, _, response, __) {
  if (process.env.NODE_ENV !== "test") {
    console.error(error.stack);
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      status: "error",
      message: "Validation failed. Please check the provided data.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof UnauthorizedException) {
    return response.status(401).json({
      status: "error",
      message: error.message,
    });
  }

  if (error instanceof NotFoundException) {
    return response.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (error instanceof ConflictException) {
    return response.status(409).json({
      status: "error",
      message: error.message,
    });
  }

  response.status(500).json({
    status: "error",
    message: "Internal Server Error",
    error: error.message,
  });
}

export { exceptionHandler };
