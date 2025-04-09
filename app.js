import express from "express";
import "dotenv/config";
import { GetAllFilesURL } from "./aws-service.js";

const app = express();

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
    console.error("Failed to list objects:", err);
    res.status(500).json({ error: "Failed to list images." });
  }
});

app.listen(process.env.WEB_SERVER_PORT, () => {
  console.log(
    `Server running at http://localhost:${process.env.WEB_SERVER_PORT}`
  );
});
