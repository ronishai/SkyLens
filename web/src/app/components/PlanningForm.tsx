import { FormEvent, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CityForm from './CityForm';
import CoordsForm from './CoordsForm';
import { on } from 'events';
interface PlanningFormProps {
  mode: 'coords' | 'city';
  onSubmit: (lat: number, lon: number, date: Date) => void;
}

function PlanningForm({ mode, onSubmit }: PlanningFormProps) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [finalLat, setFinalLat] = useState<number | null>(null);
  const [finalLon, setFinalLon] = useState<number | null>(null);

  useEffect(() => {
    setFinalLat(null);
    setFinalLon(null);
  }, [mode]);

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert('Please select a date');
      return;
    }

    if (finalLat === null || finalLon === null) {
      alert(
        mode === 'city'
          ? 'Please enter a valid city'
          : 'Please enter valid coordinates'
      );
      return;
    }

    onSubmit(finalLat, finalLon, date);
  };

  return (
    <div>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col gap-y-2 w-[40ch] mx-auto min-h-0 items-stretch"
      >
        {mode === 'city' ? (
          <CityForm
            onValidChange={(lat, lon) => {
              setFinalLat(lat);
              setFinalLon(lon);
            }}
          />
        ) : (
          <CoordsForm
            onValidChange={(lat, lon) => {
              setFinalLat(lat);
              setFinalLon(lon);
            }}
          />
        )}

        <div className="flex justify-between items-center">
          <h3>Date</h3>
          <DatePicker
            selected={date}
            onChange={(newDate: Date | null) => {
              setDate(newDate);
            }}
            showTimeSelect
            showIcon
            toggleCalendarOnIconClick
            dateFormat="dd-MM-yyyy h:mm aa"
            portalId="withPortal"
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
