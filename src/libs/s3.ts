import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(buffer: Buffer, extension = "mp3") {
  const Key = `tts/${randomUUID()}.${extension}`;

  const upload = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key,
    Body: buffer,
    ContentType: `audio/${extension}`,
  });

  await s3.send(upload);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Key}`;
}

export async function rehostImageToS3(imageUrl: string): Promise<string> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error("Failed to download image");

  const contentType = res.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new Error("Not an image");
  }

  const buffer = await res.arrayBuffer();
  const extension = contentType.split("/")[1] || "jpg";

  return await uploadToS3(Buffer.from(buffer), extension);
}
