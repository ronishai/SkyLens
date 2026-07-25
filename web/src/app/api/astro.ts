export type AstroSummary = {
  sunAltitudeDeg: number;
  moonAltitudeDeg: number;
  moonIllumination: number;
  isDarkEnough: boolean;
  rating: 'Good' | 'Neutral' | 'Bad';
  explanation: string[];
};

export async function fetchAstroSummary(
  lat: number,
  lon: number,
  dateTime: Date
): Promise<AstroSummary> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/astro/summary?lat=${lat}&lon=${lon}&dateTime=${encodeURIComponent(
      dateTime.toISOString()
    )}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch astro summary');
  }

  return response.json();
}
