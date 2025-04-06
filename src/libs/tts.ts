import {
  PollyClient,
  SynthesizeSpeechCommand,
  VoiceId,
} from "@aws-sdk/client-polly";
import { uploadToS3 } from "./s3";
import { Readable } from "stream";

const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateTTSAndUpload(
  text: string,
  voiceId: VoiceId = VoiceId.Joanna
) {
  const command = new SynthesizeSpeechCommand({
    OutputFormat: "mp3",
    Text: text,
    VoiceId: voiceId,
  });

  const { AudioStream } = await polly.send(command);
  const buffer = await streamToBuffer(AudioStream as ReadableStream);

  return await uploadToS3(buffer, "mp3");
}

// helper
function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];

    const readable = Readable.from(stream);

    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}
