// GET /api/reels/[id]

import { NextApiRequest, NextApiResponse } from "next";

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
  const {
    query: { id },
  } = req;

  const reel = reels.find((r) => r.id === id);

  if (!reel) {
    res.status(404).json({ message: "Reel not found" });
  } else {
    res.status(200).json(reel);
  }
}
