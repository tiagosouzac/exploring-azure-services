class Ticket {
  constructor({ title, description, status, userId }, id) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.userId = userId;
  }
}

export { Ticket };
