import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AstroModule } from '../astro/astro.module';
import { GeocodeModule } from '../geocode/geocode.module';

@Module({
  imports: [AstroModule, GeocodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
