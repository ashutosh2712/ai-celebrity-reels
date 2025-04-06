type PexelsPhoto = {
  src: {
    large: string;
    [key: string]: string;
  };
  [key: string]: any;
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

  const data = await res.json();
  return data.photos.map((p: PexelsPhoto) => p.src.large); // you can also use 'original' or 'landscape'
}
