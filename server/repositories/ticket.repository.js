import { Database } from "../infra/db.js";

class TicketRepository {
  #db = new Database();

  async findById(id, userId) {
    const query = "SELECT * FROM tickets WHERE id = $1 AND user_id = $2";
    const params = [id, userId];

    const result = await this.#db.query(query, params);

    return result[0];
  }

  async findByUserId(userId) {
    const query = "SELECT * FROM tickets WHERE user_id = $1";
    const params = [userId];

    const result = await this.#db.query(query, params);

    return result;
  }

  async save(ticket) {
    if (ticket.id) {
      const query =
        "UPDATE tickets SET title = $1, description = $2, status = $3 WHERE id = $4";

      const params = [
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.id,
      ];

      await this.#db.query(query, params);
    } else {
      const query =
        "INSERT INTO tickets (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING id";

      const params = [
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.userId,
      ];

      const result = await this.#db.query(query, params);
      ticket.id = result[0].id;
    }

    return ticket;
  }
}

export { TicketRepository };
