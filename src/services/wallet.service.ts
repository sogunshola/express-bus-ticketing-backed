import { EntityRepository, Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { FundWalletDto, TransferFundDto } from '../dtos/wallet.dto';
import { HttpException } from '../exceptions/HttpException';
import { Transaction } from '../entities/transaction.entity';
import { TransactionOperations, TransactionStatus, TransactionTypes } from '../interfaces/transaction.interface';
import DatabaseManager from '../databases/connection';

@EntityRepository()
class WalletService extends Repository<Wallet> {
  walletRepository: Repository<Wallet>;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await DatabaseManager.connect();
    const con = DatabaseManager.getConnection();
    this.walletRepository = con.getRepository(Wallet);
  }
  // get wallet balance
  public async getWallet(userId: number): Promise<Wallet> {
    const wallet: Wallet = await this.walletRepository.findOne({ where: { userId: userId } });
    if (!wallet) throw new HttpException(404, 'Wallet not found');
    return wallet;
  }

  // add money to wallet
  public async fundWallet(userId: number, payload: FundWalletDto): Promise<Wallet> {
    const wallet: Wallet = await this.getWallet(userId);
    wallet.balance += payload.amount;
    await this.walletRepository.update(userId, { ...wallet });
    // save transaction in db
    await Transaction.create({
      userId: userId,
      amount: payload.amount,
      status: TransactionStatus.SUCCESSFUL,
      operation: TransactionOperations.CREDIT,
      type: TransactionTypes.DEPOSIT,
    }).save();

    return wallet;
  }

  // send money from wallet to another wallet
  public async transferFunds(userId: number, payload: TransferFundDto): Promise<Wallet> {
    const queryRunner = this.walletRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet: Wallet = await this.getWallet(userId);
      if (wallet.balance < payload.amount) throw new HttpException(400, 'Insufficient funds');

      const recipientWallet: Wallet = await this.getWallet(payload.recipientId);
      wallet.balance -= payload.amount;
      recipientWallet.balance += payload.amount;

      await this.walletRepository.update(userId, { ...wallet });
      await this.walletRepository.update(payload.recipientId, { ...recipientWallet });

      await queryRunner.commitTransaction();

      // save transaction in db
      await Transaction.create({
        userId: userId,
        amount: payload.amount,
        status: TransactionStatus.SUCCESSFUL,
        operation: TransactionOperations.DEBIT,
        type: TransactionTypes.TRANSFER,
      }).save();

      await Transaction.create({
        userId: payload.recipientId,
        amount: payload.amount,
        status: TransactionStatus.SUCCESSFUL,
        operation: TransactionOperations.CREDIT,
        type: TransactionTypes.TRANSFER,
      }).save();

      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(500, err.message);
    } finally {
      await queryRunner.release();
    }
  }
}

export default WalletService;
