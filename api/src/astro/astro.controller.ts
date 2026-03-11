import { Controller, Get, Query, Header } from '@nestjs/common';
import { AstroService } from './astro.service';
import { AstroSummaryQueryDto } from './dto/astro-summary.query';

@Controller('astro')
export class AstroController {
  constructor(private readonly astroService: AstroService) {}

  @Get('summary')
  @Header(
    'Cache-Control',
    'no-cache, no-store, must-revalidate, proxy-revalidate'
  )
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getSummary(@Query() query: AstroSummaryQueryDto) {
    console.log('Received query:', query);
    return this.astroService.getSummary(query);
  }
}
