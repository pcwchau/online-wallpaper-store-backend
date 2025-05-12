import express from "express";
import multer from "multer";
import { upload, get, test } from "../controller/inspiration.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const uploadFiles = multer({ storage });

router.post("/test", test);

router.post("/upload", uploadFiles.array("images"), upload);

router.get("/get", get);

export default router;
