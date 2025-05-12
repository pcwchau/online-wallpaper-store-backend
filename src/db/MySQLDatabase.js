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
    } catch (error) {
      logger.error(
        `MySQL insert failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${error.message}`
      );
    }
  }

  async select(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      logger.error(
        `MySQL select failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${error.message}`
      );
    }
  }

  async update(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result.affectedRows;
    } catch (error) {
      logger.error(
        `MySQL update failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${error.message}`
      );
    }
  }

  async delete(sql, params = []) {
    try {
      const [result] = await this.pool.query(sql, params);
      return result.affectedRows;
    } catch (error) {
      logger.error(
        `MySQL delete failed. SQL: ${sql}, Params: ${JSON.stringify(
          params
        )}, Error: ${error.message}`
      );
    }
  }

  async close() {
    try {
      await this.pool.end();
      logger.info("MySQL connection pool closed");
    } catch (error) {
      logger.error(`Error closing MySQL pool: ${error.message}`);
    }
  }
}
