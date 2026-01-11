import {
  IsOptional,
  IsString,
  IsNumberString,
  ValidateIf,
} from 'class-validator';

export class WeatherQueryDto {
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country?: string;
}
