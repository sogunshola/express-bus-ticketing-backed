import { CreateTicketDto } from '../dtos/ticket.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import TicketService from '../services/ticket.service';
import { NextFunction, Request, Response } from 'express';

class TicketController {
  public ticketService = new TicketService();

  public getTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllTicketsData = await this.ticketService.findAllTicket();

      res.status(200).json({ data: findAllTicketsData, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };

  public getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = Number(req.params.id);
      const findOneTicketData = await this.ticketService.findTicketById(ticketId);

      res.status(200).json({ data: findOneTicketData, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };

  public createTicket = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketData: CreateTicketDto = req.body;
      const userId = req.user.id;
      const createTicketData = await this.ticketService.createTicket(userId, ticketData);

      res.status(201).json({ data: createTicketData, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };

  public updateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = Number(req.params.id);
      const ticketData: CreateTicketDto = req.body;
      const updateTicketData = await this.ticketService.updateTicket(ticketId, ticketData);

      res.status(200).json({ data: updateTicketData, message: 'Successful' });
    } catch (error) {
      next(error);
    }
  };

  public purchaseTicket = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = Number(req.params.id);
      const userId = req.user.id;
      const purchaseTicketData = await this.ticketService.purchaseTicket(ticketId, userId);

      res.status(200).json({ data: purchaseTicketData, message: 'Ticket purchase successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default TicketController;
