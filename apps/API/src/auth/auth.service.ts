import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // constructor(...) { ... }

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
      // 👉 landet im Render-Log und verrät die echte Ursache
      console.error('[REGISTER] failed:', e);

      // typische Prisma-Fehler (Unique-Constraint)
      if (e?.code === 'P2002') {
        throw new BadRequestException('E-Mail existiert bereits');
      }
      throw new InternalServerErrorException('Registration fehlgeschlagen');
    }
  }

  // login() ggf. identisch absichern
}
