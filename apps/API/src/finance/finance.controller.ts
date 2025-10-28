import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { FinanceService } from './finance.service';
import { CreateAccountDto, CreateTransactionDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class FinanceController {
  constructor(private finance: FinanceService) {}

  @Post('accounts') createAccount(@Req() req: any, @Body() dto: CreateAccountDto) {
    return this.finance.createAccount(req.user.userId, dto);
  }
  @Get('accounts') listAccounts(@Req() req: any) {
    return this.finance.listAccounts(req.user.userId);
  }
  @Post('transactions') addTransaction(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.finance.addTransaction(req.user.userId, dto);
  }
}
