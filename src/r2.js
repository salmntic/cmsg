// src/r2.js
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: process.env.R2_PUBLIC_URL,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: "auto",
  signatureVersion: "v4",
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
export default s3;