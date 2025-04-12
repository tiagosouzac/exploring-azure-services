class ConflictException extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictException";
    this.statusCode = 409;
  }
}

export { ConflictException };
