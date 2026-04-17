import { BadRequestException, Injectable } from '@nestjs/common';
import { AstroSummaryQueryDto } from './dto/astro-summary.query';
import SunCalc from 'suncalc';

type Rating = 'Good' | 'Neutral' | 'Bad';

@Injectable()
export class AstroService {
  public getSummary(query: AstroSummaryQueryDto) {
    const lat = Number(query.lat);
    const lon = Number(query.lon);
    const dateTime = new Date(query.dateTime);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lon) ||
      Number.isNaN(dateTime.getTime())
    ) {
      throw new BadRequestException(
        'Invalid input: lat, lon must be numbers and dateTime must be a valid date string'
      );
    }

    const sunAltitudeDeg =
      SunCalc.getPosition(dateTime, lat, lon).altitude * (180 / Math.PI);
    const moonAltitudeDeg =
      SunCalc.getMoonPosition(dateTime, lat, lon).altitude * (180 / Math.PI);
    const moonIllumination = SunCalc.getMoonIllumination(dateTime).fraction;

    const { rating, isUsable, isDarkEnough, explanation } = this.rateNight(
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
      isUsable,
      isDarkEnough,
      explanation,
    };
  }

  private rateNight(
    sunAlt: number,
    moonAlt: number,
    moonIllum: number
  ): {
    rating: Rating;
    isUsable: boolean;
    isDarkEnough: boolean;
    explanation: string[];
  } {
    const explanation: string[] = [];

    const isUsable = sunAlt <= -12;
    const isDarkEnough = sunAlt <= -18;

    if (!isUsable) {
      explanation.push('It is not dark enough for stargazing (sun above -12°)');
      return {
        rating: 'Bad',
        isUsable,
        isDarkEnough,
        explanation,
      };
    }

    if (!isDarkEnough) {
      explanation.push(
        'Sky is only in nautical twilight (sun between -12° and -18°), which is not ideal for stargazing.'
      );
      return { rating: 'Neutral', isUsable, isDarkEnough, explanation };
    }

    if (moonAlt < 0) {
      explanation.push(
        'The moon is below the horizon, providing optimal dark conditions.'
      );
      explanation.push(
        'Sky is fully dark enough for deep-sky observation (sun below -18°).'
      );
      return {
        rating: 'Good',
        isUsable,
        isDarkEnough,
        explanation,
      };
    }

    if (moonIllum >= 0.75 && moonAlt > 30) {
      explanation.push(
        'The bright moon will significantly affect visibility by washing out faint objects.'
      );
      return { rating: 'Bad', isUsable, isDarkEnough, explanation };
    }

    if (moonIllum >= 0.4 && moonAlt > 20) {
      explanation.push(
        'The moderately bright moon will affect visibility by reducing contrast.'
      );
      return { rating: 'Neutral', isUsable, isDarkEnough, explanation };
    }

    if (moonIllum < 0.4 || moonAlt <= 20) {
      explanation.push(
        'Moon interference is minimal, allowing for good visibility of celestial objects.'
      );
      return { rating: 'Good', isUsable, isDarkEnough, explanation };
    }

    explanation.push(
      'Conditions are acceptable, but not ideal for stargazing.'
    );
    return { rating: 'Neutral', isUsable, isDarkEnough, explanation };
  }
}
