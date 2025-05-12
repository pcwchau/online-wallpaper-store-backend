import logger from "../utils/logger.js";
import { uploadObjectsS3 } from "../api/aws.js";
import { db } from "../../server.js";

export async function test(req, res) {
  const { title, url } = req.query;

  if (!title || !url) {
    return res.status(400).json({ error: "Missing title or url" });
  }

  const sql = "INSERT INTO inspiration (title, image_url) VALUES (?, ?)";
  db.query(sql, [title, url], (err, result) => {
    if (err) {
      logger.error("Insert error:");
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.json({ message: "Data inserted", id: result.insertId });
  });
}

export async function upload(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      logger.error(`upload [FAIL] - No image files received`);
      return res.status(400).json({ error: "No image files received." });
    }
    logger.info(`upload [START] - Received files [${req.files.length}]`);

    const objectURLs = req.files.map(async (file) => {
      return await uploadObjectsS3(file, "inspiration/");
    });

    logger.info(
      `upload [END] - Fail files [${
        objectURLs.filter((item) => item === undefined).length
      }]`
    );
    res.status(200).json({
      message: "Images received successfully",
    });
  } catch (error) {
    logger.error(`upload [FAIL] - ${error}`);
    res.status(500).json({ error: "Server error while processing images." });
  }
}

export async function get(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = "SELECT title, image_url FROM inspiration LIMIT ? OFFSET ?";

    db.query(sql, [limit, offset], (err, results) => {
      if (err) {
        logger.error("Database fetch failed");
        return res.status(500).json({ error: "Database fetch failed" });
      }

      logger.info("Data fetched successfully");
      res.json({ page, limit, data: results });
    });
  } catch (error) {
    logger.error("Unexpected error in GET /list");
    res.status(500).json({ error: "Unexpected server error" });
  }
}
