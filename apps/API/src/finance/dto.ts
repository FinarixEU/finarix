import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  IsISO8601,
} from 'class-validator';

// Konto anlegen
export class CreateAccountDto {
  @IsString()
  name!: string;

  // du kannst hier deine erlaubten Werte einschränken,
  // z. B. 'bank' | 'cash' | 'card' – ich lasse es offen + Beispiel:
  @IsString()
  @IsIn(['bank', 'cash', 'card'], { message: 'type muss bank | cash | card sein' })
  type!: string;

  // optionaler Startsaldo
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  balance?: number;
}

// Transaktion anlegen
export class CreateTransactionDto {
  @Type(() => Number)
  @IsInt()
  accountId!: number;

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  // optionales Datum (ISO-8601), wenn nicht gesetzt -> now()
  @IsOptional()
  @IsISO8601()
  date?: string; // z.B. "2025-11-03T12:00:00.000Z"
}
