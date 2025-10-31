import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new BadRequestException('E-Mail ist bereits registriert');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name ?? null,
        },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      return user;
    } catch (e: any) {
      console.error('[REGISTER] failed:', e);
      if (e?.code === 'P2002') {
        throw new BadRequestException('E-Mail existiert bereits');
      }
      throw new InternalServerErrorException('Registration fehlgeschlagen');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new UnauthorizedException('Ungültige Zugangsdaten');
      }

      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) {
        throw new UnauthorizedException('Ungültige Zugangsdaten');
      }

      const accessToken = await this.jwt.signAsync({
        userId: user.id,
        email: user.email,
      });

      return { accessToken };
    } catch (e: any) {
      console.error('[LOGIN] failed:', e);
      if (e instanceof UnauthorizedException || e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Login fehlgeschlagen');
    }
  }

  async me(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
