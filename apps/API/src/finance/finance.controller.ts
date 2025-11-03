import { Body, Controller, Get, Post, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { FinanceService } from './finance.service';
import { CreateAccountDto, CreateTransactionDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  // ---- Accounts -------------------------------------------------------------
  @Get('accounts')
  async listAccounts(@Req() req: any) {
    return this.finance.listAccounts(req.user.userId);
  }

  @Post('accounts')
  async createAccount(@Req() req: any, @Body() dto: CreateAccountDto) {
    if (!dto?.name || !dto?.type) {
      throw new BadRequestException('name und type sind erforderlich');
    }
    return this.finance.createAccount(req.user.userId, dto);
  }

  // ---- Transactions ---------------------------------------------------------
  @Get('transactions')
  async listTransactions(@Req() req: any) {
    return this.finance.listTransactions(req.user.userId);
  }

  @Post('transactions')
  async createTransaction(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.finance.createTransaction(req.user.userId, dto);
  }
}
