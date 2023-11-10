import { IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  ticketDate: Date;

  @IsNotEmpty()
  departure: string;

  @IsNotEmpty()
  arrival: string;

  @IsNotEmpty()
  price: number;
}
