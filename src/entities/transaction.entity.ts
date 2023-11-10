import { Entity, Column } from 'typeorm';
import { ITransaction, TransactionOperations, TransactionStatus, TransactionTypes } from '../interfaces/transaction.interface';
import { BasicEntity } from './basic.entity';

@Entity()
export class Transaction extends BasicEntity implements ITransaction {
  @Column()
  userId: number;

  @Column({ default: 'NGN' })
  currency: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionOperations })
  operation: TransactionOperations;

  @Column({ type: 'enum', enum: TransactionTypes })
  type: TransactionTypes;
}
