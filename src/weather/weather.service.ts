import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { OpenWeatherClient } from './openweather.client';
import { Weather } from './entities/weather';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WEATHER_REPOSITORY } from './weather.providers';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(WEATHER_REPOSITORY)
    private readonly repository: Repository<Weather>,
    private readonly client: OpenWeatherClient,
  ) {}

  async fetchAndSave(query: WeatherQueryDto): Promise<any> {
    const weatherExists = await this.repository.findOneBy({
      city: query.city,
      country: query?.country,
    });

    if (weatherExists) {
      return weatherExists;
    }
    const data = await this.client.getWeatherByCity(query.city, query?.country);

    if (!data) {
      throw new BadRequestException('Error retrieving data from OpenWeather.');
    }

    const dataCreated = this.repository.create({
      city: data.name,
      country: data.sys.country,
      weather_main: data.weather[0].main,
      weather_description: data.weather[0].description,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      temperature: data.main.temp,
      thermal_sensation: data.main.feels_like,
      humidity: data.main.humidity,
      measured_at: new Date(data.dt * 1000),
    });

    return this.repository.save(dataCreated);
  }

  findAll() {
    return this.repository.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string) {
    const weather = await this.repository.findOneBy({ id });
    if (!weather) {
      throw new NotFoundException('Weather data not found.');
    }

    return weather;
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
