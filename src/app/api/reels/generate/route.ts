// POST /api/generate

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { celebrityName } = req.body;

  if (!celebrityName) {
    return res.status(400).json({ message: "Celebrity name is required" });
  }

  // TODO: Call OpenAI to generate script
  // TODO: TTS with Polly
  // TODO: Generate visuals or use RunwayML
  // TODO: Combine audio/video and upload to S3

  // Simulated response
  return res.status(200).json({
    message: `Generation triggered for ${celebrityName}`,
    videoUrl: `https://your-s3-bucket-url.com/${celebrityName
      .toLowerCase()
      .replace(" ", "-")}.mp4`,
  });
}
