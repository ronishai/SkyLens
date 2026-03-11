import React from 'react';

type Mode = 'city' | 'coords';

interface ModeToggleProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div>
      <div className="flex justify-center">
        <button
          type="button"
          className={`px-4 py-2 m-1 rounded focus:outline-none focus:ring-2 transition ${
            value === 'city'
              ? 'bg-slate-500 text-white'
              : 'bg-transparent text-white'
          }`}
          onClick={() => onChange('city')}
        >
          City
        </button>
        <button
          type="button"
          className={`px-4 py-2 m-1 rounded focus:outline-none focus:ring-2 transition ${
            value === 'coords'
              ? 'bg-slate-500 text-white'
              : 'bg-transparent text-white'
          }`}
          onClick={() => onChange('coords')}
        >
          Coordinates
        </button>
      </div>
      <br />
    </div>
  );
}

export default ModeToggle;
