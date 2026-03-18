import { Injectable } from '@nestjs/common';

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
};

@Injectable()
export class GeocodeService {
  async search(query: string) {
    const url =
      'https://nominatim.openstreetmap.org/search?' +
      new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '0',
        limit: '5',
      });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'telescope-planning-assistant/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Geocoding API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as NominatimResult[];

    return data.map((result) => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      type: result.type,
      class: result.class,
    }));
  }
}
