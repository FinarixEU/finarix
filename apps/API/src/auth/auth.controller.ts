import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './jwtAuth.guard';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login')    login(@Body() dto: LoginDto)       { return this.auth.login(dto); }

  @UseGuards(JwtAuthGuard)
  @Get('me') me(@Req() req: any) { return this.auth.me(req.user.userId); }
}
