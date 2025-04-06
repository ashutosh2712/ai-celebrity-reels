export async function fetchWikipediaPortrait(
  celebrity: string
): Promise<string | null> {
  const title = encodeURIComponent(celebrity);

  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
  );

  if (!res.ok) return null;

  const data = await res.json();

  // Extract image
  return data.originalimage?.source || null;
}
