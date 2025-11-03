import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString() name!: string;
  @IsString() type!: string; // bank | cash
  @IsOptional()
  @IsNumber() balance?: number;
}

export class CreateTransactionDto {
  @IsInt() accountId!: number;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() date?: string | Date;
}
