import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { weatherProviders } from './weather.providers';
import { OpenWeatherClient } from './openweather.client';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [WeatherController],
  providers: [... weatherProviders, WeatherService, OpenWeatherClient],
})
export class WeatherModule {}
