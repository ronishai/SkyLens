import { AstroSummary } from '../api/astro';
import GoodRatingGif from '../../assets/good-rating.webp';
import NeutralRatingGif from '../../assets/neutral-rating.webp';
import BadRatingGif from '../../assets/bad-rating.webp';

interface ResultProps {
  result: AstroSummary;
}

function Result({ result }: ResultProps) {
  return (
    <article className="flex flex-col items-center">
      <h2 className="text-2xl font-bold">Rating: {result.rating}</h2>
      <div className="my-4">
        {result.rating === 'Good' && (
          <img src={GoodRatingGif} alt="Good rating" className="w-48" />
        )}
        {result.rating === 'Neutral' && (
          <img src={NeutralRatingGif} alt="Neutral rating" className="w-48" />
        )}
        {result.rating === 'Bad' && (
          <img src={BadRatingGif} alt="Bad rating" className="w-48" />
        )}
      </div>
      <p>Moon Illumination: {(result.moonIllumination * 100).toFixed(0)}%</p>
      <p>Sun Altitude: {result.sunAltitudeDeg.toFixed(1)}°</p>
      <p>Moon Altitude: {result.moonAltitudeDeg.toFixed(1)}°</p>
      <ul>
        {result.explanation.map((line, id) => (
          <li key={id}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

export default Result;
