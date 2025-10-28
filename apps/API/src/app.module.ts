import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VersionController } from './version.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [PrismaModule, AuthModule, FinanceModule],
  controllers: [AppController, VersionController],
  providers: [],
})
export class AppModule {}
