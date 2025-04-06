import axios from "axios";

const RUNWAY_API_URL = "https://api.runwayml.com/v1/";

export async function generateRunwayVideo(prompt: string, imageUrl?: string) {
  try {
    const response = await axios.post(
      `${RUNWAY_API_URL}gen-2/videos`,
      {
        input: {
          prompt,
          image_url: imageUrl || undefined,
          num_frames: 60,
          output_format: "mp4",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { id } = response.data;
    return await pollForResult(id);
  } catch (err) {
    console.error("Runway error:", err);
    throw new Error("Runway video generation failed");
  }
}

async function pollForResult(
  id: string,
  timeout = 60_000,
  interval = 3000
): Promise<string> {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    const res = await axios.get(`${RUNWAY_API_URL}gen-2/videos/${id}`, {
      headers: { Authorization: `Bearer ${process.env.RUNWAY_API_KEY}` },
    });

    const { status, output } = res.data;

    if (status === "succeeded" && output?.video_url) {
      return output.video_url;
    }

    if (status === "failed") {
      throw new Error("Runway video generation failed");
    }

    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error("Runway video generation timed out");
}
