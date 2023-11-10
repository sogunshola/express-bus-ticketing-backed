import { Entity, Column, OneToOne } from 'typeorm';
import { IUser, UserRole } from '../interfaces/users.interface';
import { BasicEntity } from './basic.entity';
import { Wallet } from './wallet.entity';

@Entity()
export class User extends BasicEntity implements IUser {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: UserRole.USER, enum: UserRole, type: 'enum' })
  role: UserRole;

  @OneToOne(() => Wallet, wallet => wallet.user, {
    eager: true,
  })
  wallet: Wallet;
}
