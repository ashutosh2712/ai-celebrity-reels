// POST /api/reels/generate

export const runtime = "nodejs";

//import { generateDidVideo } from "@/libs/did";
//import { rehostImageToS3 } from "@/libs/s3";
import { fetchCelebrityImages } from "@/libs/pexels";
// import { generateRunwayVideo } from "@/libs/runway";
import { generateTTSAndUpload } from "@/libs/tts";
import { createVideoFromAssets } from "@/libs/video";
//import { fetchWikipediaPortrait } from "@/libs/wikipedia";
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
    const prompt = `Write a 60-second script in a fun, engaging tone about the history and highlights of ${celebrity}'s sports career. Use short, punchy sentences.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-3.5-turbo'
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const script = response.choices[0]?.message?.content || "";
    //console.log("script:", script);
    const images = await fetchCelebrityImages(`${celebrity} face portrait`);
    //const portraitImage = await fetchWikipediaPortrait(celebrity);
    //console.log("portraitImage:", portraitImage);

    //if (!portraitImage) throw new Error("No portrait found");

    // Rehost the image before passing to D-ID
    //const rehostedImageUrl = await rehostImageToS3(images[0]);
    //console.log("rehostedImageUrl:", rehostedImageUrl);

    const audioUrl = await generateTTSAndUpload(script);
    // console.log("audioUrl:", audioUrl);

    //const runwayVideoUrl = await generateRunwayVideo(script, images[0]); // optional image
    const videoUrl = await createVideoFromAssets(images.slice(0, 5), audioUrl);
    // const didVideoUrl = await generateDidVideo(
    //   rehostedImageUrl,
    //   audioUrl,
    //   script
    // );

    return NextResponse.json({
      script,
      audioUrl,
      images,
      //portraitImage,
      videoUrl: videoUrl,
    });
  } catch (error) {
    console.error(" Error while generating ai video:", error);
    return NextResponse.json(
      { message: "Failed to generate script" },
      { status: 500 }
    );
  }
};
