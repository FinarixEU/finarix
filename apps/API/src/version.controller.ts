import { Controller, Get } from '@nestjs/common';
import * as pkg from '../package.json';

@Controller()
export class VersionController {
  @Get('version')
  getversion() {
    return {
      name: (pkg as any).name ?? 'finarix-api',
      version: (pkg as any).version ?? '0.0.0'
    };
  }
}
