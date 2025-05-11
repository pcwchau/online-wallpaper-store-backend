import logger from "../utils/logger.js";
import { uploadObjectsS3 } from "../api/aws.js";

export const upload = async (req, res) => {
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
};

export const getImages = async (req, res) => {};

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
