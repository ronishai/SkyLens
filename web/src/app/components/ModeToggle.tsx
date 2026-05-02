type Mode = 'city' | 'coords';

interface ModeToggleProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className={`px-4 py-2 m-1 rounded focus:outline-none focus:ring-2 transition duration-200 ease-in-out text-white ${
          value === 'city' ? 'bg-slate-500' : 'bg-transparent'
        }`}
        onClick={() => onChange('city')}
      >
        City
      </button>
      <button
        type="button"
        className={`px-4 py-2 m-1 rounded focus:outline-none focus:ring-2 transition duration-200 ease-in-out text-white ${
          value === 'coords' ? 'bg-slate-500' : 'bg-transparent'
        }`}
        onClick={() => onChange('coords')}
      >
        Coordinates
      </button>
    </div>
  );
}

export default ModeToggle;
