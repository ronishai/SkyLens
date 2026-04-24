import { useState, useEffect } from 'react';
import { GeocodeItem, searchCity } from '../api/geocode';

interface CityFormProps {
  onValidChange: (lat: number, lon: number) => void;
}

function CityForm({ onValidChange }: CityFormProps) {
  const [city, setCity] = useState('');
  const [citySelected, setCitySelected] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoResults, setGeoResults] = useState<GeocodeItem[]>([]);

  const cityTrimmed = city.trim();
  useEffect(() => {
    if (cityTrimmed.length < 2 || citySelected) {
      return;
    }

    setGeoResults([]);
    setGeoError(null);

    const t = setTimeout(async () => {
      setGeoLoading(true);
      setGeoError(null);
      try {
        const results = await searchCity(cityTrimmed);
        setGeoResults(results);
      } catch {
        setGeoError('Error searching for city');
        setGeoResults([]);
      } finally {
        setGeoLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [cityTrimmed, citySelected]);

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        <h3>City</h3>
        <input
          className="focus:outline-none w-50 bg-slate-800 bg-opacity-50 border border-slate-700 rounded px-3 py-2"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setCitySelected(false);
          }}
        />
      </div>
      {geoLoading && <p className="text-center">Searching...</p>}
      {geoError && <p className="text-center">{geoError}</p>}
      {geoResults.length ? (
        <ul className="absolute overflow-y-auto max-h-100 z-10 w-full bg-slate-800 bg-opacity-70 border border-slate-600 mt-1 rounded shadow-xl">
          {geoResults.map((r) => (
            <li key={`${r.name}-${r.lat}-${r.lon}`}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-slate-700"
                onClick={() => {
                  setCity(r.name);
                  setCitySelected(true);
                  setGeoResults([]);
                  setGeoError(null);
                  onValidChange(r.lat, r.lon);
                }}
              >
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default CityForm;
