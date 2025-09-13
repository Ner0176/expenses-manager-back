import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @HttpCode(200)
  @Get('/status')
  checkStatus() {
    return true;
  }
}
