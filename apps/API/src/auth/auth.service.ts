import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      // Email doppelt?
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      if (existing) {
        // 409 statt 401 – semantisch korrekt
        throw new ConflictException('E-Mail ist bereits registriert');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name ?? null,       // falls optional
          passwordHash,                 // <— MUSS im Prisma-Schema existieren!
        },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      return user;
    } catch (e: any) {
      // Prisma-Fehler sauber behandeln
      if (e?.code === 'P2002') {
        // Unique-Verstoß (z. B. Email)
        throw new ConflictException('E-Mail ist bereits registriert');
      }
      this.logger.error('Register failed', e?.meta || e?.message || e);
      throw new InternalServerErrorException();
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Ungültige Zugangsdaten');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Ungültige Zugangsdaten');

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { accessToken: token };
  }

  async me(userId: number) {
    // Achtung: Wenn dein Prisma-User.id KEIN number/Int ist (z. B. String/cuid),
    // dann hier den Typ anpassen: (userId: string)
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
