import { IsEnum, IsOptional } from 'class-validator';
import { TransactionOperations } from '../interfaces/transaction.interface';

export class FilterTransactionDto {
  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  @IsEnum(TransactionOperations)
  type: TransactionOperations;
}
