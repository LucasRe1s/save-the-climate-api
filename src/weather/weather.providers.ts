import { DataSource } from 'typeorm';
import { Weather } from './entities/weather';

export const WEATHER_REPOSITORY = 'WEATHER_REPOSITORY';
export const weatherProviders = [
  {
    provide: WEATHER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Weather),
    inject: ['DATA_SOURCE'],
  },
];
