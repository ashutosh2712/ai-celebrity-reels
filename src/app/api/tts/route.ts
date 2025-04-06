import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { uploadToS3 } from "@/libs/s3";

const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const POST = async (req: NextRequest) => {
  const { text, voiceId = "Joanna" } = await req.json();

  if (!text) {
    return NextResponse.json({ message: "Text is required" }, { status: 400 });
  }

  try {
    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: voiceId, // Try 'Matthew', 'Joanna', 'Amy', etc.
    });

    const { AudioStream } = await polly.send(command);

    const buffer = await streamToBuffer(AudioStream as ReadableStream);

    const audioUrl = await uploadToS3(buffer);

    return new NextResponse(audioUrl, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename=voice.mp3",
      },
    });
  } catch (err) {
    console.error("Polly error:", err);
    return NextResponse.json({ message: "TTS failed" }, { status: 500 });
  }
};

// Helper to convert stream to buffer
async function streamToBuffer(stream: ReadableStream | null): Promise<Buffer> {
  if (!stream) return Buffer.from([]);

  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}
