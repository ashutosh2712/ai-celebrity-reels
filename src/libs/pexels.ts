type PexelsResponse = {
  photos: {
    src: {
      large: string;
      original: string;
      medium: string;
      [key: string]: string;
    };
  }[];
};

export async function fetchCelebrityImages(query: string, count = 5) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=${count}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch images from Pexels");
  }

  const data = (await res.json()) as PexelsResponse;
  return data.photos.map((p) => p.src.large);
}
