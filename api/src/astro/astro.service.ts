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

    console.log('USED INPUT:', {
      lat,
      lon,
      dateTimeRaw: query.dateTime,
      dateTimeISO: dateTime.toISOString(),
    });

    console.log('SunCalc methods:', {
      getPosition: typeof SunCalc.getPosition,
      getMoonPosition: typeof SunCalc.getMoonPosition,
      getMoonIllumination: typeof SunCalc.getMoonIllumination,
    });

    const sunAltitudeDeg =
      SunCalc.getPosition(dateTime, lat, lon).altitude * (180 / Math.PI);
    const moonAltitudeDeg =
      SunCalc.getMoonPosition(dateTime, lat, lon).altitude * (180 / Math.PI);
    const moonIllumination = SunCalc.getMoonIllumination(dateTime).fraction;

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
    let explanation = '';

    const isDarkEnough = sunAlt <= -12;

    if (!isDarkEnough) {
      explanation =
        'It is not dark enough for good stargazing (sun above -12°)';
      return { rating: 'Bad', isDarkEnough, explanation: [explanation] };
    }

    if (moonAlt < 0) {
      explanation =
        'The moon is below the horizon, providing optimal dark conditions.';
      return {
        rating: sunAlt <= -18 ? 'Good' : 'Neutral',
        isDarkEnough,
        explanation: [explanation],
      };
    }

    if (moonIllum >= 0.75 && moonAlt > 20) {
      explanation = 'The bright moon will significantly affect visibility.';
      return { rating: 'Bad', isDarkEnough, explanation: [explanation] };
    }

    if (moonIllum >= 0.4 && moonAlt > 20) {
      explanation = 'The moderately bright moon will affect visibility.';
      return { rating: 'Neutral', isDarkEnough, explanation: [explanation] };
    }

    explanation = 'Conditions are good for stargazing.';
    return { rating: 'Good', isDarkEnough, explanation: [explanation] };
  }
}
