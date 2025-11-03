import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString() name!: string;
  @IsString() type!: 'bank' | 'cash';
  @IsNumber() @Min(0) balance!: number; // Startsaldo
}

export class CreateTransactionDto {
  @IsInt() accountId!: number;
  @IsNumber() amount!: number; // positiv/negativ erlaubt
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() date?: string; // ISO (optional)
}
