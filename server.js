import fs from "fs";
import http from "http";
import https from "https";
import logger from "./src/utils/logger.js";
import app from "./src/app.js";
import MySQLDatabase from "./src/db/MySQLDatabase.js";

export const mysql = new MySQLDatabase();

mysql.verifyConnection();

if (process.env.NODE_ENV === "production") {
  try {
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
  } catch (error) {
    logger.error(
      `[Production] HTTPS server cannot be started. Error: ${error}`
    );
    mysql.close();
    process.exit(1);
  }
} else if (process.env.NODE_ENV === "development") {
  http.createServer(app).listen(process.env.WEB_SERVER_PORT, () => {
    logger.info(
      `[Development] HTTP server running at http://localhost:${process.env.WEB_SERVER_PORT}`
    );
  });
} else {
  logger.error("NODE_ENV must be either 'production' or 'development'.");
  mysql.close();
  process.exit(1);
}
