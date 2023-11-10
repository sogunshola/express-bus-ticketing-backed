import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import WalletService from '../services/wallet.service';
import { IUser } from '../interfaces/users.interface';
import { FundWalletDto, TransferFundDto } from '../dtos/wallet.dto';

class WalletController {
  public walletService = new WalletService();

  public getWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.user;
      const userId = userData.id;
      const walletBalance = await this.walletService.getWallet(userId);

      res.status(200).json({ data: walletBalance, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };

  public fundWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const payload: FundWalletDto = req.body;
      const wallet = await this.walletService.fundWallet(userId, payload);

      res.status(200).json({ data: wallet, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };

  public transferFunds = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const payload: TransferFundDto = req.body;
      const wallet = await this.walletService.transferFunds(userId, payload);

      res.status(200).json({ data: wallet, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
