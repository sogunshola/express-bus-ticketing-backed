import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import TransactionController from '../controllers/transaction.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { FilterTransactionDto } from '../dtos/transaction.dto';

class TransactionRoute implements Routes {
  public transactionController = new TransactionController();
  public router: Router = Router();
  public path = '/transactions';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, validationMiddleware(FilterTransactionDto, 'body'), this.transactionController.getTransactions);
  }
}

export default TransactionRoute;
