export interface IWallet {
  id: number;
  balance: number;
  currency: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
