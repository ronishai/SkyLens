import { Injectable } from '@nestjs/common';
import { AstroSummaryQueryDto } from './dto/astro-summary.query';
import sunCalc from 'suncalc';

type Rating = 'Good' | 'Neutral' | 'Bad';

@Injectable()
export class AstroService {
  public getSummary(query: AstroSummaryQueryDto) {
    console.log('USED INPUT:', {
      lat: query.lat,
      lon: query.lon,
      dateTimeRaw: query.dateTime,
      dateTimeISO: new Date(query.dateTime).toISOString(),
    });

    const lat = Number(query.lat);
    const lon = Number(query.lon);
    const dateTime = new Date(query.dateTime);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lon) ||
      Number.isNaN(dateTime.getTime())
    ) {
      throw new Error(
        'Invalid input: lat, lon must be numbers and dateTime must be a valid date string'
      );
    }

    const sunAltitudeDeg =
      sunCalc.getPosition(dateTime, lat, lon).altitude * (180 / Math.PI);
    const moonAltitudeDeg =
      sunCalc.getMoonPosition(dateTime, lat, lon).altitude * (180 / Math.PI);
    const moonIllumination = sunCalc.getMoonIllumination(dateTime).fraction;

    const { rating, isDarkEnough, explanation } = this.rateNight(
      sunAltitudeDeg,
      moonAltitudeDeg,
      moonIllumination
    );

    return {
      input: { lat, lon, dateTime },
      sunAltitudeDeg,
      moonAltitudeDeg,
      moonIllumination,
      rating,
      isDarkEnough,
      explanation,
    };
  }

  private rateNight(
    sunAlt: number,
    moonAlt: number,
    moonIllum: number
  ): { rating: Rating; isDarkEnough: boolean; explanation: string[] } {
    const explanation: string[] = [];

    const isDarkEnough = sunAlt <= -12;
    explanation.push(`Sun altitude is ${sunAlt.toFixed(1)}°`);

    if (!isDarkEnough) {
      explanation.push(
        'It is not dark enough for good stargazing (sun above -12°)'
      );
      return { rating: 'Bad', isDarkEnough, explanation };
    }

    // TODO: move to UI
    explanation.push(`Moon altitude is ${moonAlt.toFixed(1)}°`);
    explanation.push(`Moon illumination is ${(moonIllum * 100).toFixed(1)}%`);

    if (moonAlt < 0) {
      explanation.push(
        'The moon is below the horizon, providing optimal dark conditions.'
      );
      return {
        rating: sunAlt <= -18 ? 'Good' : 'Neutral',
        isDarkEnough,
        explanation,
      };
    }

    if (moonIllum >= 0.75 && moonAlt > 20) {
      explanation.push(
        'The bright moon high in the sky will significantly affect visibility.'
      );
      return { rating: 'Bad', isDarkEnough, explanation };
    }

    if (moonIllum >= 0.4 && moonAlt > 20) {
      explanation.push('The moderately bright moon will affect visibility.');
      return { rating: 'Neutral', isDarkEnough, explanation };
    }

    explanation.push('Conditions are good for stargazing.');
    return { rating: 'Good', isDarkEnough, explanation };
  }
}
