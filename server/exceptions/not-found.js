class NotFoundException extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFound";
    this.statusCode = 404;
  }
}

export { NotFoundException };
