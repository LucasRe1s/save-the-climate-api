import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { WEATHER_REPOSITORY } from './weather.providers';
import { OpenWeatherClient } from './openweather.client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('WeatherService', () => {
  let service: WeatherService;

  const weatherEntityMock = {
    id: 'uuid-test-id',
    city: 'Test City',
    country: 'BR',
    weather_main: 'Clouds',
    weather_description: 'Cloudy',
    longitude: 0,
    latitude: 0,
    temperature: 25,
    thermal_sensation: 27,
    humidity: 80,
    measured_at: new Date('2025-01-01T00:00:00.000Z'),
    created_at: new Date('2025-01-02T00:00:00.000Z'),
  };

  const openWeatherApiMock = {
    name: 'Test City',
    sys: { country: 'BR' },
    weather: [{ main: 'Clouds', description: 'Cloudy' }],
    coord: { lon: 10, lat: -10 },
    main: { temp: 25, feels_like: 27, humidity: 80 },
    dt: 1700000000, // unix seconds
  };

  const repositoryMock = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const clientMock = {
    getWeatherByCity: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: WEATHER_REPOSITORY, useValue: repositoryMock },
        { provide: OpenWeatherClient, useValue: clientMock },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  describe('fetchAndSave', () => {
    it('should return existing weather when it already exists', async () => {
      repositoryMock.findOneBy.mockResolvedValueOnce(weatherEntityMock);

      const result = await service.fetchAndSave({ city: 'Test City', country: 'BR' });

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
        city: 'Test City',
        country: 'BR',
      });
      expect(clientMock.getWeatherByCity).not.toHaveBeenCalled();
      expect(repositoryMock.create).not.toHaveBeenCalled();
      expect(repositoryMock.save).not.toHaveBeenCalled();
      expect(result).toEqual(weatherEntityMock);
    });

    it('should fetch from API and save when it does not exist', async () => {
      repositoryMock.findOneBy.mockResolvedValueOnce(null);
      clientMock.getWeatherByCity.mockResolvedValueOnce(openWeatherApiMock);

      repositoryMock.create.mockImplementationOnce((data) => data);
      repositoryMock.save.mockResolvedValueOnce(weatherEntityMock);

      const result = await service.fetchAndSave({ city: 'Test City', country: 'BR' });

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
        city: 'Test City',
        country: 'BR',
      });

      expect(clientMock.getWeatherByCity).toHaveBeenCalledWith('Test City', 'BR');

      expect(repositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          city: 'Test City',
          country: 'BR',
          weather_main: 'Clouds',
          weather_description: 'Cloudy',
          longitude: 10,
          latitude: -10,
          temperature: 25,
          thermal_sensation: 27,
          humidity: 80,
          measured_at: new Date(openWeatherApiMock.dt * 1000),
        }),
      );

      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(weatherEntityMock);
    });

    it('should throw BadRequestException when API returns no data', async () => {
      repositoryMock.findOneBy.mockResolvedValueOnce(null);
      clientMock.getWeatherByCity.mockResolvedValueOnce(null);

      await expect(
        service.fetchAndSave({ city: 'Test City', country: 'BR' }),
      ).rejects.toBeInstanceOf(BadRequestException);

      await expect(
        service.fetchAndSave({ city: 'Test City', country: 'BR' }),
      ).rejects.toThrow('Error retrieving data from OpenWeather.');

      expect(repositoryMock.create).not.toHaveBeenCalled();
      expect(repositoryMock.save).not.toHaveBeenCalled();
    });

    it('should bubble up errors from repository.save', async () => {
      repositoryMock.findOneBy.mockResolvedValueOnce(null);
      clientMock.getWeatherByCity.mockResolvedValueOnce(openWeatherApiMock);
      repositoryMock.create.mockImplementationOnce((data) => data);

      repositoryMock.save.mockRejectedValueOnce(new Error('DB error'));

      await expect(
        service.fetchAndSave({ city: 'Test City', country: 'BR' }),
      ).rejects.toThrow('DB error');
    });
  });

  describe('findAll', () => {
    it('should return all weather ordered by created_at DESC', async () => {
      repositoryMock.find.mockResolvedValueOnce([weatherEntityMock]);

      const result = await service.findAll();

      expect(repositoryMock.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual([weatherEntityMock]);
    });
  });

  describe('findOne', () => {
    it('should return weather when found', async () => {
      repositoryMock.findOneBy.mockResolvedValueOnce(weatherEntityMock);

      const result = await service.findOne('uuid-test-id');

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 'uuid-test-id' });
      expect(result).toEqual(weatherEntityMock);
    });

    it('should throw NotFoundException when not found', async () => {
      repositoryMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.findOne('invalid-id')).rejects.toBeInstanceOf(NotFoundException);
      await expect(service.findOne('invalid-id')).rejects.toThrow('Weather data not found.');
    });
  });

  describe('remove', () => {
    it('should call repository.delete with id', async () => {
      repositoryMock.delete.mockResolvedValueOnce({ affected: 1 });

      await service.remove('uuid-test-id');

      expect(repositoryMock.delete).toHaveBeenCalledWith('uuid-test-id');
    });
  });
});
