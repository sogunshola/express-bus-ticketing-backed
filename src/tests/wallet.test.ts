import request from 'supertest';
import App from '../app';
import WalletController from '../controllers/wallet.controller';
import { FundWalletDto, TransferFundDto } from '../dtos/wallet.dto';
import { IUser, UserRole } from '../interfaces/users.interface';
import { RequestWithUser } from '../interfaces/auth.interface';
import WalletRoute from '../routes/wallet.route';

jest.mock('../services/wallet.service');

const mockedWalletService = jest.requireMock('../services/wallet.service').default;

describe('Wallet Routes', () => {
  let app: App;
  let walletController: WalletController;
  const walletRoute = new WalletRoute();

  beforeAll(async () => {
    app = new App([walletRoute]);
    walletController = new WalletController();
    // app.addController(walletController);
  });

  describe('[GET] /wallet', () => {
    it('should get wallet balance', async () => {
      const mockRequest: RequestWithUser = {
        user: { id: 1, email: 'test@example.com', password: 'password', name: 'Test User', role: UserRole.USER } as IUser,
      } as RequestWithUser;

      mockedWalletService.prototype.getWallet.mockResolvedValue(100); // Mock the getWallet method

      const response = await request(app.getServer())
        .get(walletRoute.path + '/wallet')
        .set('Authorization', 'Bearer testToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: 100, message: 'Successful' });
    });
  });

  describe('[POST] /wallet/fund', () => {
    it('should fund the wallet', async () => {
      const mockRequest: RequestWithUser = {
        user: { id: 1, email: 'test@example.com', password: 'password', name: 'Test User', role: UserRole.USER } as IUser,
        body: { amount: 50 } as FundWalletDto,
      } as RequestWithUser;

      mockedWalletService.prototype.fundWallet.mockResolvedValue(150); // Mock the fundWallet method

      const response = await request(app.getServer())
        .post(walletRoute.path + '/wallet/fund')
        .set('Authorization', 'Bearer testToken')
        .send({ amount: 50 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: 150, message: 'Successful' });
    });
  });

  describe('[POST] /wallet/transfer', () => {
    it('should transfer funds', async () => {
      const mockRequest: RequestWithUser = {
        user: { id: 1, email: 'test@example.com', password: 'password', name: 'Test User', role: UserRole.USER } as IUser,
        body: { recipientId: 2, amount: 25 } as TransferFundDto,
      } as RequestWithUser;

      mockedWalletService.prototype.transferFunds.mockResolvedValue(75); // Mock the transferFunds method

      const response = await request(app.getServer())
        .post(walletRoute.path + '/wallet/transfer')
        .set('Authorization', 'Bearer testToken')
        .send({ recipientId: 2, amount: 25 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: 75, message: 'Successful' });
    });
  });
});
