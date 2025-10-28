import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // /health und /api/health funktionieren beide
  @Get(['health','api/health'])
  health() {
    return { status: 'ok', message: 'Finarix API is running 🚀' };
  }
}
