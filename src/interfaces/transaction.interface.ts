export enum TransactionOperations {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum TransactionTypes {
  DEPOSIT = 'deposit',
  TICKET_PURCHASE = 'ticket_purchase',
  TRANSFER = 'transfer',
}

export interface ITransaction {
  id: number;
  amount: number;
  currency: string;
  userId: number;
  operation: TransactionOperations;
  status: TransactionStatus;
  type: TransactionTypes;
  createdAt: Date;
  updatedAt: Date;
}
