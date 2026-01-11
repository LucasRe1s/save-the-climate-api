import {
  IsOptional,
  IsString,
  IsNumberString,
  ValidateIf,
} from 'class-validator';

export class WeatherQueryDto {
  @IsString()
  city: string;

  @IsString()
  country?: string;
}
