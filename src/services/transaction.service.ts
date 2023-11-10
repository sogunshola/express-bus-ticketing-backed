import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { FilterTransactionDto } from '../dtos/transaction.dto';
import DatabaseManager from '../databases/connection';

@EntityRepository()
class TransactionService extends Repository<Transaction> {
  private transactionRepository: Repository<Transaction>;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await DatabaseManager.connect();
    const con = DatabaseManager.getConnection();
    this.transactionRepository = con.getRepository(Transaction);
  }

  public async findAllTransactions(userId: number, payload: FilterTransactionDto): Promise<Transaction[]> {
    const query = this.transactionRepository.createQueryBuilder('transaction').where('transaction.userId = :userId', { userId });
    if (payload.startDate && payload.endDate) {
      query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate: payload.startDate,
        endDate: payload.endDate,
      });
    }

    if (payload.type) {
      query.andWhere('transaction.operation = :type', { type: payload.type });
    }

    const transactions = await query.getMany();
    return transactions;
  }
}

export default TransactionService;
