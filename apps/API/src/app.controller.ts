import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // /health ohne Prefix (wird durch exclude in main.ts freigestellt)
  @Get('health')
  health() {
    return { status: 'ok', message: 'Finarix API is running 🚀' };
  }
}
