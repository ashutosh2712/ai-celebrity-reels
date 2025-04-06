// // GET /api/reels

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const GET = async () => {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: "metadata/",
    });

    const listData = await s3.send(listCommand);
    const keys = listData.Contents?.map((obj) => obj.Key).filter(
      Boolean
    ) as string[];

    const metadataList = await Promise.all(
      keys.map(async (key) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        const data = await s3.send(getCommand);
        const stream = data.Body as NodeJS.ReadableStream;

        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk as Buffer);
        }
        const json = Buffer.concat(chunks).toString("utf-8");
        return JSON.parse(json);
      })
    );

    return NextResponse.json(metadataList, { status: 200 });
  } catch (error) {
    console.error("Error listing reels from S3:", error);
    return NextResponse.json(
      { message: "Failed to load reels" },
      { status: 500 }
    );
  }
};
