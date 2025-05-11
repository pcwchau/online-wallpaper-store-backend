import express from "express";
import multer from "multer";
import { upload, getImages } from "../controller/inspiration.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const uploadFiles = multer({ storage });

router.post("/upload", uploadFiles.array("images"), upload);

router.get("/getImages", getImages);

export default router;
