import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, CreateTransactionDto } from './dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createAccount(userId: number, dto: CreateAccountDto) {
    return this.prisma.account.create({ data: { name: dto.name, type: dto.type, userId } });
  }

  async listAccounts(userId: number) {
    return this.prisma.account.findMany({ where: { userId }, include: { transactions: true } });
  }

  async addTransaction(userId: number, dto: CreateTransactionDto) {
    const account = await this.prisma.account.findUnique({ where: { id: dto.accountId } });
    if (!account || account.userId !== userId) throw new ForbiddenException();

    const tx = await this.prisma.transaction.create({
      data: { userId, accountId: dto.accountId, amount: dto.amount, description: dto.description ?? null }
    });
    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { balance: account.balance.plus(dto.amount) }
    });
    return tx;
  }

  async listTransactions(userId: number) {
    return this.prisma.transaction.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }
}
