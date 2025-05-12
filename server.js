import fs from "fs";
import http from "http";
import https from "https";
import logger from "./src/utils/logger.js";
import app from "./src/app.js";
import mysql from "mysql2";

export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: process.env.MYSQL_DB_NAME,
});

db.connect((error) => {
  if (error) {
    logger.error(`MySQL connection error: ${error}`);
    process.exit(1);
  }
  logger.info(
    `Connected to MySQL - [${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}]`
  );
});

if (process.env.NODE_ENV === "production") {
  const httpsOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/web.beshinegroup.com/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/web.beshinegroup.com/fullchain.pem"
    ),
  };

  https
    .createServer(httpsOptions, app)
    .listen(process.env.WEB_SERVER_PORT, () => {
      logger.info(
        `[Production] HTTPS server running at https://localhost:${process.env.WEB_SERVER_PORT}`
      );
    });
} else if (process.env.NODE_ENV === "development") {
  http.createServer(app).listen(process.env.WEB_SERVER_PORT, () => {
    logger.info(
      `[Development] HTTP server running at http://localhost:${process.env.WEB_SERVER_PORT}`
    );
  });
} else {
  logger.error("NODE_ENV must be either 'production' or 'development'.");
  process.exit(1);
}
