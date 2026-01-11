import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Not } from 'typeorm';

@Injectable()
export class OpenWeatherClient {
  constructor(private readonly http: HttpService, private readonly configService: ConfigService) {}

  async getWeatherByCity(city: string, country?: string) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new NotFoundException('Chave de API do OpenWeather não está configurada.');
    }
    try {
           const response = await firstValueFrom(
        this.http.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: city && country ? `${city},${country}` : city,
            appid: process.env.OPENWEATHER_API_KEY,
            units: 'metric',
            lang: 'pt_br',
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar dados na OpenWeather',
        error.response?.status || 500,
      );
    }
  }
}
