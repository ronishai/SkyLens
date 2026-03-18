import { FormEvent, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GeocodeItem, searchCity } from '../api/geocode';

interface PlanningFormProps {
  mode: 'coords' | 'city';
  onSubmit: (lat: number, lon: number, date: Date) => void;
}

function PlanningForm({ mode, onSubmit }: PlanningFormProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoResults, setGeoResults] = useState<GeocodeItem[]>([]);

  const cityTrimmed = city.trim();

  useEffect(() => {
    if (mode === 'coords') setCity('');
    if (mode === 'city') {
      setLat('');
      setLon('');
    }
    setGeoResults([]);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'city' || cityTrimmed.length < 2) {
      setGeoResults([]);
      setGeoError(null);
      return;
    }

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
  }, [cityTrimmed, mode]);

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (
      !date ||
      isNaN(latNum) ||
      isNaN(lonNum) ||
      latNum < -90 ||
      latNum > 90 ||
      lonNum < -180 ||
      lonNum > 180
    ) {
      alert('Please enter valid coordinates');
      return;
    }

    onSubmit(latNum, lonNum, date);
  };

  return (
    <div>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col gap-y-2 w-[40ch] mx-auto items-stretch"
      >
        {mode === 'city' ? (
          <div>
            <div className="flex justify-between items-center">
              <h3>City</h3>
              <input
                className="focus:outline-none w-50 bg-slate-800 bg-opacity-50 border border-slate-700 rounded px-3 py-2"
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            {geoLoading && <p className="text-center">Searching...</p>}
            {geoError && <p className="text-center">{geoError}</p>}
            <ul className="absolute z-10 w-full bg-slate-800 bg-opacity-70 border border-slate-600 mt-1 rounded shadow-xl">
              {geoResults.map((r) => (
                <li key={`${r.name}-${r.lat}-${r.lon}`}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-slate-700"
                    onClick={() => {
                      setLat(r.lat.toString());
                      setLon(r.lon.toString());
                      setCity(r.name);
                      setGeoResults([]);
                      setGeoError(null);
                    }}
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <h3>Latitude</h3>
              <input
                className="focus:outline-none w-50 bg-slate-800 bg-opacity-50 border border-slate-700 rounded px-3 py-2"
                type="number"
                placeholder="Enter latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <h3>Longitude</h3>
              <input
                className="focus:outline-none w-50 bg-slate-800 bg-opacity-50 border border-slate-700 rounded px-3 py-2"
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
            className="focus:outline-none h-12 cursor-pointer bg-slate-800 bg-opacity-50 border border-slate-700 rounded px-3 py-2 transition duration-200 ease-in-out"
          />
        </div>

        <div className="flex justify-center">
          <button
            className="cursor-pointer w-32 h-10 bg-slate-800 hover:bg-slate-600 border border-slate-700 rounded transition duration-200 ease-in-out"
            type="submit"
          >
            Plan my night
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlanningForm;
