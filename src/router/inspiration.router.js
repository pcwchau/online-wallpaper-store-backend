import express from "express";
import multer from "multer";
import { uploadObjectsS3 } from "../api/aws.js";
import {
  addInspirations,
  getInspirations,
  removeDuplicateTitles,
  getInspirationCount,
} from "../db/inspiration.db.js";
import { isPositiveInteger } from "../utils/validation.js";
import { successResponse } from "../utils/response.js";

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
router.post("/upload", uploadFiles.array("images"), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw {
        statusCode: 400,
        errorCode: "INVALID_PARAMS",
        message: "No image files received.",
      };
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
    successResponse(
      res,
      {},
      `${req.files.length} images received. ${newRows} images uploaded.`
    );

    await removeDuplicateTitles();
  } catch (err) {
    next(err);
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
 */
router.get("/get", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    if (!isPositiveInteger(page) || !isPositiveInteger(limit)) {
      throw {
        statusCode: 400,
        errorCode: "INVALID_PARAMS",
        message: "Positive integer is required for `page` and `limit`.",
      };
    }
    const result = await getInspirations(page, limit);
    successResponse(res, result, "Get inspiration images successfully.");
  } catch (err) {
    next(err);
  }
});

/**
 * GET /inspiration/getCount
 *
 * Response:
 * 200 - {"count":3009}
 */
router.get("/getCount", async (_req, res, next) => {
  try {
    const result = await getInspirationCount();
    successResponse(
      res,
      { count: result[0]["COUNT(*)"] },
      "Get count of inspiration images successfully."
    );
  } catch (err) {
    next(err);
  }
});

export default router;
