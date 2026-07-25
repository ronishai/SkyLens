export type GeocodeItem = {
  name: string;
  lat: number;
  lon: number;
  type: string;
  class: string;
};

export async function searchCity(query: string): Promise<GeocodeItem[]> {
  if (!query || query.trim().length < 2) return [];

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/geocode/search?query=${encodeURIComponent(query.trim())}`
  );
  if (!response.ok) {
    throw new Error(
      `Geocoding API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
