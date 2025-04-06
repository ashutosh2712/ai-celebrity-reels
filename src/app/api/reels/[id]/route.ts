// // GET /api/reels/[id]

// import { NextRequest, NextResponse } from "next/server";

// import { reels } from "@/data"; //import dummy data

// export const GET = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   const { id } = params;
//   try {
//     const reel = reels.find((r) => r.id === id);
//     if (!reel) {
//       return NextResponse.json({ message: "Reel not found" }, { status: 404 });
//     }

//     return NextResponse.json(reel, { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Something went wrong!" },
//       { status: 500 }
//     );
//   }
// };
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const { id } = context.params;

  try {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `metadata/${id}.json`,
    });

    const data = await s3.send(getCommand);
    const stream = data.Body as NodeJS.ReadableStream;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    const json = Buffer.concat(chunks).toString("utf-8");
    const metadata = JSON.parse(json);

    return NextResponse.json(metadata, { status: 200 });
  } catch (err) {
    const error = err as { name?: string; message?: string };
    console.error("Error loading reel metadata:", error);
    return NextResponse.json(
      { message: "Failed to load reel" },
      { status: 500 }
    );
  }
};
