import { NotFoundException } from "../exceptions/not-found.js";
import { ConflictException } from "../exceptions/conflict.js";

function exceptionHandler(error, _, response, __) {
  if (process.env.NODE_ENV !== "test") {
    console.error(error.stack);
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
