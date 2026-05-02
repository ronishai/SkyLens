import { Type } from 'class-transformer';
import { IsISO8601, IsNumber, Max, Min } from 'class-validator';

export class AstroSummaryQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon!: number;

  @IsISO8601()
  dateTime!: string;
}
