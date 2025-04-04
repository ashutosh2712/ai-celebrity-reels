// GET /api/reels

import { NextApiRequest, NextApiResponse } from "next";

// Dummy data
const reels = [
  {
    id: "serena-williams",
    title: "Serena Williams Career Highlights",
    s3Url: "https://your-s3-bucket-url.com/serena.mp4",
    sport: "Tennis",
    duration: "60s",
  },
  {
    id: "messi",
    title: "Messi: The GOAT Story",
    s3Url: "https://your-s3-bucket-url.com/messi.mp4",
    sport: "Football",
    duration: "60s",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(reels);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
