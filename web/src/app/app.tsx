import { useState } from 'react';
import { AstroSummary, fetchAstroSummary } from './api/astro';
import Background from './components/Background';
import ModeToggle from './components/ModeToggle';
import Modal from './components/Modal';
import Result from './components/Result';
import PlanningForm from './components/PlanningForm';

type LocationMode = 'coords' | 'city';

export function App() {
  const [mode, setMode] = useState<LocationMode>('coords');
  const [result, setResult] = useState<AstroSummary | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onPlanNightFormSubmitted(
    lat: number,
    lon: number,
    date: Date
  ) {
    try {
      setLoading(true);
      const summary = await fetchAstroSummary(lat, lon, date);
      setResult(summary);
      setIsModalOpen(true);
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
        <header>
          <h1 className="text-4xl font-bold text-center">SkyLens</h1>
          <h2 className="text-2xl font-semibold text-center">
            Telescope Planning Assistant
          </h2>
        </header>

        {loading && <p className="text-center">Loading...</p>}
        <ModeToggle
          value={mode}
          onChange={(newMode) => {
            setMode(newMode);
            setResult(undefined);
          }}
        />

        <PlanningForm mode={mode} onSubmit={onPlanNightFormSubmitted} />

        {isModalOpen && result && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Result result={result} />
          </Modal>
        )}
      </main>
    </div>
  );
}

export default App;
