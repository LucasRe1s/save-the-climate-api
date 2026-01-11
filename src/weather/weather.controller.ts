import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherService } from './weather.service';
import { ResponseWeatherDto } from './dto/weather-response.dto';

@Controller('weathers')
export class WeatherController {
  constructor(private readonly service: WeatherService) {}
  @Post()
  async getWeatherBy(
    @Query() query: WeatherQueryDto,
  ): Promise<ResponseWeatherDto> {
    return new ResponseWeatherDto(await this.service.fetchAndSave(query));
  }

  @Get('/all')
  async findAll(): Promise<ResponseWeatherDto[]> {
    const data = await this.service.findAll();
    return data.map((item) => new ResponseWeatherDto(item));
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseWeatherDto | null> {
    const data = await this.service.findOne(id);
    return data ? new ResponseWeatherDto(data) : null;
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
