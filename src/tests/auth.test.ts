import bcrypt from 'bcrypt';
import request from 'supertest';
import App from '../app';
import { CreateUserDto, LoginDto } from '../dtos/users.dto';
import { User } from '../entities/user.entity';
import AuthRoute from '../routes/auth.route';
import { UserRole } from '../interfaces/users.interface';
import DatabaseManager from '../databases/connection';

beforeAll(async () => {
  await DatabaseManager.connect();
});

afterAll(async () => {
  await DatabaseManager.disconnect();
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
        name: 'test user',
        role: UserRole.USER,
      };

      const authRoute = new AuthRoute();
      const userRepository = DatabaseManager.getConnection()?.getRepository(User);

      userRepository!.findOne = jest.fn().mockReturnValue(null);
      userRepository!.save = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        name: userData.name,
      });

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have user and token', async () => {
      const userData: LoginDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const authRoute = new AuthRoute();
      const userRepository = DatabaseManager.getConnection()?.getRepository(User);

      userRepository!.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        name: 'test user',
      });

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}login`).send(userData).expect(200);
    });
  });

  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post(`${authRoute.path}logout`)
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
