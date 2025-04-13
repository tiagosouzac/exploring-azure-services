class TicketDto {
  constructor(ticket) {
    this.id = ticket.id;
    this.title = ticket.title;
    this.description = ticket.description;
    this.status = ticket.status;
    this.userId = ticket.userId;
  }
}

export { TicketDto };
