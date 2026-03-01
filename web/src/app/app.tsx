import styles from './app.module.css';
import { useState, useEffect, ChangeEvent } from 'react';
import { AstroSummary, fetchAstroSummary } from '../api/astro';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GeocodeItem, searchCity } from '../api/geocode';

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

  const handleModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMode = e.target.checked ? 'city' : 'coords';
    setMode(newMode);
    setResult(undefined);
  };

  async function handlePlanNight() {
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
    <div>
      <h1>Telescope Planning Assistant</h1>
      <main>
        {loading && <p>Loading...</p>}

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={mode === 'city'}
            onChange={handleModeChange}
          />
          Search by city name
        </label>
        {mode === 'city' && (
          <div>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {geoLoading && <p>Searching...</p>}
            {geoError && <p className={styles.error}>{geoError}</p>}
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
        <div className={styles.location}>
          <h3>Latitude</h3>
          <input
            type="number"
            placeholder="Enter latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <h3>Longitude</h3>
          <input
            type="number"
            placeholder="Enter longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        </div>

        <DatePicker
          selected={date}
          onChange={(newDate: Date | null) => {
            setDate(newDate);
          }}
          className={styles.datepicker}
          showIcon
          toggleCalendarOnIconClick
        />
        <button className={styles.button} onClick={handlePlanNight}>
          Plan my night
        </button>

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
