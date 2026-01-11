import { Weather } from '../entities/weather';

export class ResponseWeatherDto {
  id: string;
  city: string;
  country: string;
  weather_main: string;
  weather_description: string;
  longitude: number;
  latitude: number;
  temperature: number;
  thermal_sensation: number;
  humidity: number;
  measured_at: Date;
  created_at: Date;

  constructor(entity: Weather) {
    this.id = entity.id;
    this.city = entity.city;
    this.country = entity.country;
    this.weather_main = entity.weather_main;
    this.weather_description = entity.weather_description;
    this.longitude = entity.longitude;
    this.latitude = entity.latitude;
    this.temperature = entity.temperature;
    this.thermal_sensation = entity.thermal_sensation;
    this.humidity = entity.humidity;
    this.measured_at = entity.measured_at;
    this.created_at = entity.created_at;
  }
}
