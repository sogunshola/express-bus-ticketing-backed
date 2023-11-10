import { EntityRepository, Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { HttpException } from '../exceptions/HttpException';
import { CreateTicketDto } from '../dtos/ticket.dto';
import DatabaseManager from '../databases/connection';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionOperations, TransactionStatus, TransactionTypes } from '../interfaces/transaction.interface';

@EntityRepository()
class TicketService extends Repository<Ticket> {
  private ticketRepository: Repository<Ticket>;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await DatabaseManager.connect();
    const con = DatabaseManager.getConnection();
    this.ticketRepository = con.getRepository(Ticket);
  }

  public async findOneTicket(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new HttpException(404, 'Ticket not found');
    return ticket;
  }

  public async findAllTicket(): Promise<Ticket[]> {
    const query = this.ticketRepository.createQueryBuilder('ticket').where('ticket.ticketDate <= :today', { today: new Date() });
    return query.getMany();
  }

  public async findTicketById(ticketId: number): Promise<Ticket> {
    const findTicket: Ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!findTicket) throw new HttpException(409, "Ticket doesn't exist");

    return findTicket;
  }

  public async createTicket(userId: number, ticketData: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepository.create({ ...ticketData, userId });
    return this.save(ticket);
  }

  public async updateTicket(ticketId: number, ticketData: CreateTicketDto): Promise<Ticket> {
    const findTicket: Ticket = await this.findOneTicket(ticketId);
    if (!findTicket) throw new HttpException(409, "Ticket doesn't exist");

    await Ticket.update(ticketId, { ...ticketData });

    const updateTicket: Ticket = await this.findOneTicket(ticketId);
    return updateTicket;
  }

  public async deleteTicket(ticketId: number): Promise<Ticket> {
    const findTicket: Ticket = await this.findOneTicket(ticketId);
    if (!findTicket) throw new HttpException(409, "Ticket doesn't exist");

    await this.delete(ticketId);
    return findTicket;
  }

  public async purchaseTicket(userId: number, ticketId: number): Promise<Ticket> {
    const findTicket: Ticket = await this.findOneTicket(ticketId);
    if (!findTicket) throw new HttpException(409, "Ticket doesn't exist");
    const user = await User.findOne({ where: { id: userId }, relations: ['wallet'] });
    if (!user) throw new HttpException(409, "User doesn't exist");

    // check if user has enough balance
    if (user.wallet.balance < findTicket.price) throw new HttpException(409, 'Insufficient funds');

    // update user balance
    user.wallet.balance -= findTicket.price;
    // update ticket user wallet
    const ticketUser = await User.findOne({ where: { id: findTicket.userId }, relations: ['wallet'] });
    if (!ticketUser) throw new HttpException(409, "Ticket user doesn't exist");
    ticketUser.wallet.balance += findTicket.price;
    await user.wallet.save();
    await ticketUser.wallet.save();

    // update ticket: add the detail of the user ticket here

    // create transaction
    await Transaction.create({
      userId,
      amount: findTicket.price,
      operation: TransactionOperations.DEBIT,
      status: TransactionStatus.SUCCESSFUL,
      type: TransactionTypes.TICKET_PURCHASE,
    }).save();

    await Transaction.create({
      userId: findTicket.userId,
      amount: findTicket.price,
      operation: TransactionOperations.CREDIT,
      status: TransactionStatus.SUCCESSFUL,
      type: TransactionTypes.TICKET_PURCHASE,
    }).save();

    return findTicket;
  }
}

export default TicketService;
