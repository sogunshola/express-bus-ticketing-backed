import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import WalletController from '../controllers/wallet.controller';
import validationMiddleware from '../middlewares/validation.middleware';
import { FundWalletDto, TransferFundDto } from '../dtos/wallet.dto';
import authMiddleware from '../middlewares/auth.middleware';

class WalletRoute implements Routes {
  public path = '/wallets';
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.walletController.getWallet);
    this.router.post(`${this.path}/fund`, authMiddleware, validationMiddleware(FundWalletDto, 'body'), this.walletController.fundWallet);
    this.router.post(`${this.path}/transfer`, authMiddleware, validationMiddleware(TransferFundDto, 'body'), this.walletController.transferFunds);
  }
}

export default WalletRoute;
