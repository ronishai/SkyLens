import { useState, useEffect } from 'react';

interface CoordsFormProps {
  onValidChange: (lat: number, lon: number) => void;
}

function CoordsForm({ onValidChange }: CoordsFormProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  useEffect(() => {
    if (lat === '' || lon === '') {
      return;
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    const isValid =
      !isNaN(latNum) &&
      !isNaN(lonNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lonNum >= -180 &&
      lonNum <= 180;

    if (isValid) {
      onValidChange(latNum, lonNum);
    }
  }, [lat, lon, onValidChange]);

  return (
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
  );
}

export default CoordsForm;
