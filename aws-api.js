import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import "dotenv/config";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function listObjects(folder) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: folder,
      MaxKeys: 10,
    });

    const response = await s3.send(command);
    console.log(response);
    return response.Contents;
  } catch (error) {
    console.error("Error listing objects:", error);
  }
}
