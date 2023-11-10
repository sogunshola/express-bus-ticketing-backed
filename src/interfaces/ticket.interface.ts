export interface ITicket {
  id: number;
  title: string;
  ticketDate: Date;
  departure: string;
  arrival: string;
  userId: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
