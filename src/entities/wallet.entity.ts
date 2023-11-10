import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { IWallet } from '../interfaces/wallet.interface';
import { BasicEntity } from './basic.entity';

@Entity()
export class Wallet extends BasicEntity implements IWallet {
  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ default: 'NGN' })
  currency: string;

  @Column()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
