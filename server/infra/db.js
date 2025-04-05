import pg from "pg";

class Database {
  constructor() {
    this.client = new pg.Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  async query(query) {
    try {
      await this.client.connect();
      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    } finally {
      await this.client.end();
    }
  }
}

export const db = new Database();
