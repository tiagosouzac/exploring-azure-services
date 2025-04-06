import pg from "pg";

class Database {
  async connect() {
    if (!this.client) {
      this.client = new pg.Client({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      });

      await this.client.connect();
    }
  }

  async query(query, params) {
    try {
      await this.connect();
      const result = await this.client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    } finally {
      await this.client.end();
      this.client = null;
    }
  }
}

export { Database };
