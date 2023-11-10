import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { ITicket } from '../interfaces/ticket.interface';
import { BasicEntity } from './basic.entity';
import { User } from './user.entity';

@Entity()
export class Ticket extends BasicEntity implements ITicket {
  @Column()
  title: string;

  @Column({ type: 'timestamp' })
  ticketDate: Date;

  @Column()
  departure: string;

  @Column()
  arrival: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'float', default: 0 })
  price: number;
}
