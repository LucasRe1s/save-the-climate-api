import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('/')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  healthCheck(): Object{
    return this.healthCheckService.healthCheck();
  }
}
