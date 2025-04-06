import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadMetadata(metadata: object, videoId: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `metadata/${videoId}.json`,
    Body: JSON.stringify(metadata),
    ContentType: "application/json",
  });

  await s3.send(command);
  console.log("Metadata uploaded to S3");
}
