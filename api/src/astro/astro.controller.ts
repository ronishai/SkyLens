import { Controller, Get, Query } from '@nestjs/common';
import { AstroService } from './astro.service';
import { AstroSummaryQueryDto } from './dto/astro-summary.query';

@Controller('astro')
export class AstroController {
  constructor(private readonly astroService: AstroService) {}

  @Get('summary')
  async getSummary(@Query() query: AstroSummaryQueryDto) {
    return this.astroService.getSummary(query);
  }
}
