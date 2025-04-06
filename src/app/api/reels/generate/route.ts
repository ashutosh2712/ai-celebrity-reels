// POST /api/reels/generate

export const runtime = "nodejs";

import { fetchCelebrityImages } from "@/libs/pexels";
// import { generateRunwayVideo } from "@/libs/runway";
import { generateTTSAndUpload } from "@/libs/tts";
import { createVideoFromAssets } from "@/libs/video";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // From.env file
});

export const POST = async (req: NextRequest) => {
  const { celebrity } = await req.json();

  if (!celebrity) {
    return NextResponse.json(
      { message: "Celebrity is required" },
      { status: 400 }
    );
  }

  try {
    const images = await fetchCelebrityImages(celebrity);
    const prompt = `Write a 60-second script in a fun, engaging tone about the history and highlights of ${celebrity}'s sports career. Use short, punchy sentences.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-3.5-turbo'
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const script = response.choices[0]?.message?.content || "";

    const audioUrl = await generateTTSAndUpload(script);
    // console.log("audioUrl:", audioUrl);

    //const runwayVideoUrl = await generateRunwayVideo(script, images[0]); // optional image
    const videoUrl = await createVideoFromAssets(images.slice(0, 5), audioUrl);

    return NextResponse.json({
      script,
      audioUrl,
      images,
      videoUrl: videoUrl,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { message: "Failed to generate script" },
      { status: 500 }
    );
  }
};
