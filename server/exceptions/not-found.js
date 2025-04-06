class NotFoundException extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFound";
    this.statusCode = 404;
  }
}

export { NotFoundException };
