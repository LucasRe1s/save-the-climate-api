import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenWeatherClient {
  constructor(private readonly http: HttpService, private readonly configService: ConfigService) {}

  async getWeatherByCity(city: string, country?: string) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('OPENWEATHER_API_KEY não configurada');
    }
    try {
           const response = await firstValueFrom(
        this.http.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: city && country ? `${city},${country}` : city,
            appid: apiKey,
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
