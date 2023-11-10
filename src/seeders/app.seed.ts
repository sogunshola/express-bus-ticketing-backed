import { Seeder } from 'typeorm-seeding';
import { User } from '../entities/user.entity';
import { Ticket } from '../entities/ticket.entity';
import { Connection } from 'typeorm';
import { ITicket } from '../interfaces/ticket.interface';
import { Wallet } from '../entities/wallet.entity';
import { IUser, UserRole } from '../interfaces/users.interface';

export default class AppSeeder implements Seeder {
  public async run(_: any, connection: Connection): Promise<any> {
    try {
      // Clear existing data
      await connection.synchronize(true);

      // Seed 1 admin user
      const adminUser: IUser = {
        id: 1,
        email: 'admin@example.com',
        password: 'adminpassword',
        name: 'Admin User',
        role: UserRole.ADMIN,
      };
      const adminWallet = {
        id: 1,
        balance: 0,
        userId: 1,
      };

      await connection.createQueryBuilder().insert().into(User).values(adminUser).execute();
      await connection.createQueryBuilder().insert().into(Wallet).values(adminWallet).execute();

      // Seed 10 random tickets
      const tickets: ITicket[] = [];
      for (let i = 1; i <= 10; i++) {
        const ticket: ITicket = {
          id: i + 1,
          title: `Ticket ${i}`,
          ticketDate: new Date('2024-01-01'),
          departure: 'City A',
          arrival: 'City B',
          userId: 1, // Assuming the admin user has ID 1
          price: 50.0 + i, // Adjust the price logic as needed
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        tickets.push(ticket);
      }

      await connection.createQueryBuilder().insert().into(Ticket).values(tickets).execute();

      console.log('Seeding complete');
    } catch (error) {
      console.error('Error during seeding', error);
    } finally {
      await connection.close();
    }
  }
}
