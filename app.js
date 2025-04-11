import express from "express";
import cors from "cors";
import "dotenv/config";
import { GetAllFilesURL } from "./aws-service.js";

const app = express();

app.use(cors());

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
    console.error("Failed to get images:", err);
    res.status(500).json({ error: "Failed to get images." });
  }
});

app.listen(process.env.WEB_SERVER_PORT, () => {
  console.log(
    `Server running at http://localhost:${process.env.WEB_SERVER_PORT}`
  );
});
