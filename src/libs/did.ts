import axios from "axios";

export async function generateDidVideo(
  imageUrl: string,
  audioUrl: string,
  scriptText: string
): Promise<string> {
  const apiKey = process.env.DID_API_KEY!;
  const endpoint = "https://api.d-id.com/talks";

  const res = await axios.post(
    endpoint,
    {
      source_url: imageUrl,
      script: {
        type: "text",
        input: scriptText,
        ssml: false,
        subtitles: false,
        provider: {
          type: "microsoft", // or "aws"
          voice_id: "Sara", // Try "Matthew", "Joanna", "Jenny", etc.
        },
      },
      config: {
        fluent: false,
      },
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
    }
  );

  const talkId = res.data.id;

  return await pollForDidResult(talkId, apiKey);
}

async function pollForDidResult(id: string, apiKey: string): Promise<string> {
  const statusUrl = `https://api.d-id.com/talks/${id}`;
  const maxWait = 60_000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    const statusRes = await axios.get(statusUrl, {
      headers: { Authorization: `Basic ${apiKey}` },
    });

    if (statusRes.data.result_url) {
      return statusRes.data.result_url;
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error("D-ID video generation timed out");
}
