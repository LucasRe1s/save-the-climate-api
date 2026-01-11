import { Injectable } from '@nestjs/common';
const API_VERSION = process.env.npm_package_version || '1.0.0';

@Injectable()
export class HealthCheckService {
  healthCheck(): Object {
    return {
      status: 'ok',
      version: API_VERSION,
      uptime: process.uptime(),
      Date: new Date().toDateString(),
    };
  }
}
