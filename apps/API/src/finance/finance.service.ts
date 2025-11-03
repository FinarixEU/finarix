import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateAccountDto, CreateTransactionDto } from './dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------- Accounts -----------------
  async listAccounts(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, type: true, balance: true, createdAt: true },
    });
  }

  async createAccount(userId: number, dto: CreateAccountDto) {
    const balance = dto.balance ?? 0;
    return this.prisma.account.create({
      data: {
        name: dto.name,
        type: dto.type,
        balance: new Prisma.Decimal(balance),
        userId,
      },
      select: { id: true, name: true, type: true, balance: true, createdAt: true },
    });
  }

  // --------------- Transactions --------------
  async listTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        createdAt: true,
        account: { select: { id: true, name: true } },
      },
    });
  }

  async createTransaction(userId: number, dto: CreateTransactionDto) {
    if (!dto.accountId) throw new BadRequestException('accountId fehlt');
    if (dto.amount === undefined || dto.amount === null)
      throw new BadRequestException('amount fehlt');

    // Prüfen, ob das Konto dem User gehört
    const acc = await this.prisma.account.findUnique({ where: { id: dto.accountId } });
    if (!acc) throw new NotFoundException('Konto nicht gefunden');
    if (acc.userId !== userId) throw new ForbiddenException('Kein Zugriff auf dieses Konto');

    const amount = new Prisma.Decimal(dto.amount);
    const tx = await this.prisma.transaction.create({
      data: {
        amount,
        description: dto.description ?? null,
        date: dto.date ? new Date(dto.date) : new Date(),
        accountId: dto.accountId,
        userId,
      },
      select: {
        id: true, amount: true, description: true, date: true, createdAt: true,
        account: { select: { id: true, name: true } },
      },
    });

    // Saldo des Kontos anpassen
    await this.prisma.account.update({
      where: { id: acc.id },
      data: { balance: acc.balance.add(amount) },
    });

    return tx;
  }
}
