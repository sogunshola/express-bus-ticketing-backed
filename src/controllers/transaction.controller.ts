import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import TransactionService from '../services/transaction.service';
import { FilterTransactionDto } from '../dtos/transaction.dto';

class TransactionController {
  public transactionService = new TransactionService();

  public getTransactions = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const payload: FilterTransactionDto = req.query as any;
      const transactions = await this.transactionService.findAllTransactions(userId, payload);

      res.status(200).json({ data: transactions, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
