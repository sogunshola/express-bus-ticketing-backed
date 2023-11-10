import UserService from './users.service';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginDto } from '@dtos/users.dto';
import { User } from '@/entities/user.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import DatabaseManager from '../databases/connection';

@EntityRepository()
class AuthService extends Repository<User> {
  private userService = new UserService();

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

  public async signup(userData: CreateUserDto): Promise<{ token: string; user: IUser }> {
    const user = await this.userService.createUser(userData);
    const token = this.createToken(user);

    return { user, token: token.token };
  }

  public async login(userData: LoginDto): Promise<{ token: string; user: IUser }> {
    const findUser: IUser = await User.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = this.createToken(findUser);

    delete findUser.password;

    return { user: findUser, token: tokenData.token };
  }

  public async logout(userData: IUser): Promise<IUser> {
    const findUser: IUser = await User.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
