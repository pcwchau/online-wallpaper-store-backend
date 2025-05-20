import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import logger from "../utils/logger.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// folder: "example/"
export async function uploadObjectsS3(file, folder) {
  try {
    const fileKey = folder + file.originalname;
    logger.info(`uploadObjectsS3 [START] - File key [${fileKey}]`);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await s3.send(command);
    logger.info(`uploadObjectsS3 [SUCCESS] - File key [${fileKey}]`);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  } catch (error) {
    logger.error(`uploadObjectsS3 [FAIL] - ${error}`);
    throw error;
  }
}
