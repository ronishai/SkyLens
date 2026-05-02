import { Module } from '@nestjs/common';
import { AstroController } from './astro.controller';
import { AstroService } from './astro.service';

@Module({
  controllers: [AstroController],
  providers: [AstroService],
})
export class AstroModule {}
