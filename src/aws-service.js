// import { listObjects } from "./aws-api.js";

// export async function GetAllFilesURL(folder) {
//   const objArr = await listObjects(folder);

//   if (objArr?.length > 0) {
//     const urls = objArr
//       .filter((obj) => !obj.Key.endsWith("/"))
//       .map((obj) => {
//         return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`;
//       });

//     console.log("Total files found:", urls.length);
//     return urls;
//   }
// }
