import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // GET /health  -> ohne Prefix erreichbar (für Render Health Check)
  @Get('health')
  health() {
    return { status: 'ok', message: 'Finarix API is running 🚀' };
  }
}
