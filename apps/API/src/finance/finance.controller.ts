import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { FinanceService } from './finance.service';
import { CreateAccountDto, CreateTransactionDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  // Konten
  @Get('accounts')
  listAccounts(@Req() req: any) {
    return this.finance.listAccounts(req.user.userId);
  }

  @Post('accounts')
  createAccount(@Req() req: any, @Body() dto: CreateAccountDto) {
    return this.finance.createAccount(req.user.userId, dto);
  }

  // Transaktionen
  @Get('transactions')
  listTransactions(@Req() req: any) {
    return this.finance.listTransactions(req.user.userId);
  }

  @Post('transactions')
  createTransaction(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.finance.createTransaction(req.user.userId, dto);
  }
}
