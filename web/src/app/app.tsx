import styles from './app.module.css';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { AstroSummary, fetchAstroSummary } from './api/astro';
import DatePicker from 'react-datepicker';
import { GeocodeItem, searchCity } from './api/geocode';
import Background from './components/Background';
import ModeToggle from './components/ModeToggle';

type LocationMode = 'coords' | 'city';

export function App() {
  const [mode, setMode] = useState<LocationMode>('coords');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [city, setCity] = useState('');
  const [geoResults, setGeoResults] = useState<GeocodeItem[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [result, setResult] = useState<AstroSummary | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const latNum = Number(lat);
  const lonNum = Number(lon);

  const cityTrimmed = city.trim();

  useEffect(() => {
    if (mode !== 'city') return;

    if (cityTrimmed.length < 2) {
      setGeoResults([]);
      setGeoError(null);
      return;
    }

    let alive = true;
    const t = setTimeout(async () => {
      try {
        setGeoLoading(true);
        setGeoError(null);
        const results = await searchCity(cityTrimmed);
        if (alive) {
          setGeoResults(results);
        }
      } catch {
        if (alive) {
          setGeoError('Error searching for city');
        }
      } finally {
        if (alive) {
          setGeoLoading(false);
        }
      }
    }, 400);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [cityTrimmed, mode]);

  async function onPlanNightFormSubmitted(e: FormEvent) {
    e.preventDefault();

    if (Number.isNaN(latNum) || Number.isNaN(lonNum) || !date) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      console.log(
        `Fetching astro summary for lat=${latNum}, lon=${lonNum}, date=${date.toISOString()}`
      );
      const summary = await fetchAstroSummary(latNum, lonNum, date);

      setResult(summary);
    } catch (error) {
      console.log(error);
      alert('Error fetching astro summary');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white flex justify-center">
      <Background />
      <main className="w-full max-w-xl flex flex-col gap-4 p-6">
        <h1 className="text-3xl font-bold text-center">SkyLens</h1>
        <h2 className="text-2x font-semibold text-center">
          Telescope Planning Assistant
        </h2>

        {loading && <p>Loading...</p>}
        <ModeToggle value={mode} onChange={(newMode) => setMode(newMode)} />

        <form
          onSubmit={onPlanNightFormSubmitted}
          className="flex flex-col gap-y-2 w-[40ch] mx-auto items-stretch"
        >
          {mode === 'city' && (
            <div>
              <div className="flex justify-between items-center">
                <h3>City</h3>
                <input
                  className="focus:outline-none bg-slate-900 border border-slate-700 rounded px-3 py-2"
                  type="text"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {geoLoading && <p>Searching...</p>}
              {geoError && <p>{geoError}</p>}
              <ul>
                {geoResults.map((r) => (
                  <li key={`${r.name}-${r.lat}-${r.lon}`}>
                    <button
                      onClick={() => {
                        setLat(r.lat.toString());
                        setLon(r.lon.toString());
                      }}
                    >
                      {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mode === 'coords' && (
            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between items-center">
                <h3>Latitude</h3>
                <input
                  className="focus:outline-none bg-slate-900 border border-slate-700 rounded px-3 py-2"
                  type="number"
                  placeholder="Enter latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <h3>Longitude</h3>
                <input
                  className="focus:outline-none bg-slate-900 border border-slate-700 rounded px-3 py-2"
                  type="number"
                  placeholder="Enter longitude"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3>Date</h3>
            <DatePicker
              selected={date}
              onChange={(newDate: Date | null) => {
                setDate(newDate);
              }}
              showIcon
              toggleCalendarOnIconClick
              dateFormat="dd-MM-yyyy"
              className="focus:outline-none w-39 h-10 cursor-pointer bg-slate-900 border border-slate-700 rounded px-3 py-2 transition duration-200 ease-in-out"
            />
          </div>

          <div className="flex justify-center">
            <button
              className="cursor-pointer w-32 h-10 bg-slate-900 hover:bg-slate-600 border border-slate-700 rounded transition duration-200 ease-in-out"
              type="submit"
            >
              Plan my night
            </button>
          </div>
        </form>

        {result && (
          <article className={styles.result}>
            <h2>Rating: {result.rating}</h2>
            <p>
              Moon Illumination: {(result.moonIllumination * 100).toFixed(0)}%
            </p>
            <ul className={styles.explanation}>
              {result.explanation.map((e: string) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </article>
        )}
      </main>
    </div>
  );
}

export default App;
