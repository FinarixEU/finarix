import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
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
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new BadRequestException('E-Mail ist bereits registriert');

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: { email: dto.email, passwordHash, name: dto.name ?? null },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      return user;
    } catch (e: any) {
      // >>> temporäres, ausführliches Logging
      console.error('[REGISTER] failed', {
        name: e?.name,
        code: e?.code,
        message: e?.message,
        meta: e?.meta,
        stack: e?.stack,
      });
      // gleiche Antwort ans Frontend
      if (e?.code === 'P2002') throw new BadRequestException('E-Mail existiert bereits');
      throw new InternalServerErrorException('Registration fehlgeschlagen');
    }
  }
      const user = await this.prisma.user.create({
        data,
        select: { id: true, email: true, name: true, createdAt: true },
      });

      return user;
    } catch (e: any) {
      // 💡 Mehr Debug-Infos in den Logs
      console.error('[REGISTER] failed', {
        name: e?.name,
        code: e?.code,
        message: e?.message,
        meta: e?.meta,
      });

      // Prisma: Unique violation
      if (e?.code === 'P2002') {
        throw new BadRequestException('E-Mail existiert bereits');
      }

      // Bessere Fehlermeldung (temporär hilfreich)
      throw new InternalServerErrorException(
        'Registration fehlgeschlagen'
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      if (!dto?.email || !dto?.password) {
        throw new BadRequestException('E-Mail und Passwort sind erforderlich');
      }

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
      console.error('[LOGIN] failed', {
        name: e?.name,
        code: e?.code,
        message: e?.message,
        meta: e?.meta,
      });

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
