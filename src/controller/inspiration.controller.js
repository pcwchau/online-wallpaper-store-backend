import logger from "../utils/logger.js";
import { uploadObjectsS3 } from "../api/aws.js";
import {
  addInspirations,
  getInspirations,
  removeDuplicateTitles,
} from "../db/inspiration.db.js";

export async function test(req, res) {}

export async function upload(req, res) {
  if (!req.files || req.files.length === 0) {
    logger.error(`upload [FAIL] - No image files received`);
    return res.status(400).json({ error: "No image files received." });
  }
  const inspirations = await Promise.all(
    req.files.map(async (file) => {
      const objectUrl = await uploadObjectsS3(file, "inspiration/");
      return { title: file.originalname, imageUrl: objectUrl };
    })
  );
  const newRows = await addInspirations(inspirations);
  if (newRows) {
    res.json({ message: `${newRows} image uploaded.` });
    await removeDuplicateTitles();
  } else {
    res.status(500).json({ error: `Server error.` });
  }
}

export async function get(req, res) {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page === NaN || limit === NaN || page < 1 || limit < 0) {
    return res.status(400).json({ error: "Invalid params." });
  }

  const result = await getInspirations(page, limit);
  if (result) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Server error." });
  }
}
