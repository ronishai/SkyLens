import { AstroSummary } from '../api/astro';

interface ResultProps {
  result: AstroSummary;
}

function Result({ result }: ResultProps) {
  return (
    <div>
      <article className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">Rating: {result.rating}</h2>
        <p>
          Moon Illumination: {(result.moonIllumination * 100).toFixed(0)}% Sun
          Altitude: {result.sunAltitudeDeg.toFixed(1)}° Moon Altitude:{' '}
          {result.moonAltitudeDeg.toFixed(1)}°
        </p>
        <ul>
          <li>{result.explanation}</li>
        </ul>
      </article>
    </div>
  );
}

export default Result;
