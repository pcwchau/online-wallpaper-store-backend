import express from "express";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GetAllFilesURL } from "./aws-service.js";
import { logger } from "./logger.js";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  const { method, url } = req;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  logger.info(`Request: ${method} ${url} from ${ip} - ${userAgent}`);
  next();
});

// 200 {"timestamp":"2025-04-11T15:11:11.868Z"}
app.get("/", (req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

// /images?folder={folder_name}
// 200 {images: ["url1", "url2", ...]}
// 400 {error: "Missing or invalid 'folder' parameter."}
// 404 {error: "No images found."}
// 500 {error: "Failed to get images."}
app.get("/images", async (req, res) => {
  const folder = req.query.folder;

  if (!folder || typeof folder !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'folder' parameter." });
  }

  try {
    const urls = await GetAllFilesURL(folder);
    if (!urls || urls.length === 0) {
      return res.status(404).json({ error: "No images found." });
    }

    res.json({ images: urls });
  } catch (err) {
    logger.error("Failed to get images:", err);
    res.status(500).json({ error: "Failed to get images." });
  }
});

// START THE WEB SERVER
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
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
