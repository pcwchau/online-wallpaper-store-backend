import express from "express";
import multer from "multer";
import logger from "../utils/logger.js";
import { uploadObjectsS3 } from "../api/aws.js";
import {
  addInspirations,
  getInspirations,
  removeDuplicateTitles,
} from "../db/inspiration.db.js";
import { isPositiveInteger } from "../utils/validation.js";

const router = express.Router();
const storage = multer.memoryStorage();
const uploadFiles = multer({ storage });

/**
 * POST /inspiration/upload
 *
 * Header:
 * Content-Type: multipart/form-data
 *
 * Body:
 * | Field Name | Type    | Required | Description                       |
 * | ---------- | ------- | -------- | --------------------------------- |
 * | images     | File[]  | Yes      | One or more image files to upload |
 *
 * Response:
 * 200 - {"message":"5 images received. 5 images uploaded."}
 * 400 - { error: "No image files received." }
 * 500 - { error: "Server error." }
 */
router.post("/upload", uploadFiles.array("images"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    logger.error(`Upload inspiration images - No image files received`);
    return res.status(400).json({ error: "No image files received." });
  }
  const inspirations = await Promise.all(
    req.files.map(async (file) => {
      try {
        const objectUrl = await uploadObjectsS3(file, "inspiration/");
        return { title: file.originalname, imageUrl: objectUrl };
      } catch (error) {
        return { title: file.originalname, imageUrl: undefined };
      }
    })
  );
  const successfulInspirations = inspirations.filter(
    (item) => item.imageUrl !== undefined
  );
  const failedInspirations = inspirations.filter(
    (item) => item.imageUrl === undefined
  );

  const newRows = await addInspirations(successfulInspirations);
  if (newRows) {
    res.json({
      message: `${req.files.length} images received. ${newRows} images uploaded.`,
    });
    await removeDuplicateTitles();
  } else {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * GET /inspiration/get
 *
 * Query Parameters:
 * | Name  | Type   | Required | Description                         | Example |
 * | ----- | ------ | -------- | ----------------------------------- | ------- |
 * | page  | number | Yes      | Page number (1-based, must be > 0)  | `1`     |
 * | limit | number | Yes      | Number of items per page (must > 0) | `10`    |
 *
 * Response:
 * 200 - [{"title":"...","image_url":"..."}, ...]
 * 400 - { error: "Invalid params." }
 * 500 - { error: "Server error." }
 */
router.get("/get", async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  if (!isPositiveInteger(page) || !isPositiveInteger(limit)) {
    return res.status(400).json({ error: "Invalid params." });
  }

  const result = await getInspirations(page, limit);
  if (result !== undefined) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
