import mysql from "mysql2/promise";
import logger from "../utils/logger.js";

export default class MySQLDatabase {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PW,
      database: process.env.MYSQL_DB_NAME,
      connectionLimit: 20,
    });
  }

  async verifyConnection() {
    try {
      const connection = await this.pool.getConnection();
      logger.info("MySQL connection successful");
      connection.release();
    } catch (err) {
      logger.error(`MySQL connection failed: ${err.message}`);
      process.exit(1);
    }
  }

  async insert(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result.affectedRows;
    } catch (err) {
      throw new Error(
        `MySQL INSERT failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${err.message}`
      );
    }
  }

  async select(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result;
    } catch (err) {
      throw new Error(
        `MySQL SELECT failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${err.message}`
      );
    }
  }

  async update(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result.affectedRows;
    } catch (err) {
      throw new Error(
        `MySQL UPDATE failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${err.message}`
      );
    }
  }

  async delete(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result.affectedRows;
    } catch (err) {
      throw new Error(
        `MySQL DELETE failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${err.message}`
      );
    }
  }

  async close() {
    try {
      await this.pool.end();
      logger.info("MySQL connection pool closed");
    } catch (err) {
      logger.error(`Error closing MySQL pool: ${err.message}`);
    }
  }
}
