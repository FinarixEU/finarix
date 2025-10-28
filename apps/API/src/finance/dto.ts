import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateAccountDto { @IsString() name!: string; @IsString() type!: string; }
export class CreateTransactionDto {
  @IsInt() accountId!: number;
  @IsNumber() @Min(0.01) amount!: number;
  @IsOptional() @IsString() description?: string;
}
