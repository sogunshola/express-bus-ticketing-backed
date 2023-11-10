import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@/entities/user.entity';
import { HttpException } from '@exceptions/HttpException';
import { IUser } from '@interfaces/users.interface';
import { Wallet } from '../entities/wallet.entity';
import DatabaseManager from '../databases/connection';

@EntityRepository(User)
class UserService extends Repository<User> {
  private userRepository: Repository<User>;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await DatabaseManager.connect();
    const con = DatabaseManager.getConnection();
    this.userRepository = con.getRepository(User);
  }

  public async findAllUser(): Promise<IUser[]> {
    const users: IUser[] = await User.find();
    return users;
  }

  public async findUserById(userId: number): Promise<IUser> {
    const findUser: IUser = await User.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<IUser> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findUser: IUser = await User.findOne({ where: { email: userData.email } });
      if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

      const hashedPassword = await hash(userData.password, 10);
      const user = User.create({ ...userData, password: hashedPassword });
      const createUserData = await queryRunner.manager.save(user);

      const wallet = Wallet.create({ balance: 0, userId: createUserData.id });
      await queryRunner.manager.save(wallet);

      await queryRunner.commitTransaction();
      delete createUserData.password;
      return createUserData;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(500, err.message);
    } finally {
      await queryRunner.release();
    }
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<IUser> {
    const findUser: IUser = await User.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await User.update(userId, { ...userData, password: hashedPassword });

    const updateUser: IUser = await User.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<IUser> {
    const findUser: IUser = await User.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await User.delete({ id: userId });
    return findUser;
  }
}

export default UserService;
