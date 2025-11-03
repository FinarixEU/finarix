import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, CreateTransactionDto } from './dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Konten ---
  async listAccounts(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, type: true, balance: true, createdAt: true },
    });
  }

  async createAccount(userId: number, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        balance: dto.balance ?? 0,
      },
      select: { id: true, name: true, type: true, balance: true, createdAt: true },
    });
  }

  // --- Transaktionen ---
  async listTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        createdAt: true,
        account: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async createTransaction(userId: number, dto: CreateTransactionDto) {
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
      select: { id: true },
    });
    if (!account) throw new NotFoundException('Konto nicht gefunden');

    // Schreibe Transaktion und aktualisiere Saldo atomar
    const txDate = dto.date ? new Date(dto.date) : new Date();

    const [created] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          userId,
          accountId: dto.accountId,
          amount: dto.amount,
          description: dto.description ?? null,
          date: txDate,
        },
        select: {
          id: true,
          amount: true,
          description: true,
          date: true,
          createdAt: true,
          account: { select: { id: true, name: true, type: true } },
        },
      }),
      this.prisma.account.update({
        where: { id: dto.accountId },
        data: { balance: { increment: dto.amount } },
      }),
    ]);

    return created;
  }
}
