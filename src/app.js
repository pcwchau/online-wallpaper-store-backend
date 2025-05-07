import express from "express";
import cors from "cors";
// import { GetAllFilesURL } from "./aws-service.js";
import logger from "./logger.js";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  const { method, url } = req;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  logger.info(`${method} Request: URL[${url}] IP [${ip}]`);
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
// app.get("/images", async (req, res) => {
//   const folder = req.query.folder;

//   if (!folder || typeof folder !== "string") {
//     return res
//       .status(400)
//       .json({ error: "Missing or invalid 'folder' parameter." });
//   }

//   try {
//     const urls = await GetAllFilesURL(folder);
//     if (!urls || urls.length === 0) {
//       return res.status(404).json({ error: "No images found." });
//     }

//     res.json({ images: urls });
//   } catch (err) {
//     logger.error("Failed to get images:", err);
//     res.status(500).json({ error: "Failed to get images." });
//   }
// });

export default app;
