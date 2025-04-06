import { Database, db } from "../infra/db.js";

class UserRepository {
  #db = new Database();

  async findById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const params = [id];

    const result = await this.#db.query(query, params);

    return result[0];
  }

  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const params = [email];

    const result = await this.#db.query(query, params);

    return result[0];
  }

  async save(user) {
    if (user.id) {
      const query = "UPDATE users SET name = $1, email = $2 WHERE id = $3";
      const params = [user.name, user.email, user.id];
      await this.#db.query(query, params);
    } else {
      const query =
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id";
      const params = [user.name, user.email, user.password, user.role];

      const result = await this.#db.query(query, params);
      user.id = result[0].id;
    }

    return user;
  }
}

export { UserRepository };
