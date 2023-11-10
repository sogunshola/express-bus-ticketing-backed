import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import TicketController from '../controllers/ticket.controller';
import { CreateTicketDto } from '../dtos/ticket.dto';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { UserRole } from '../interfaces/users.interface';

class TicketRoute implements Routes {
  public path = '/tickets';
  public router = Router();
  public ticketController = new TicketController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.ticketController.getTickets);
    this.router.get(`${this.path}/:id`, authMiddleware, roleMiddleware([UserRole.ADMIN]), this.ticketController.getTicketById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      roleMiddleware([UserRole.ADMIN]),
      validationMiddleware(CreateTicketDto, 'body'),
      this.ticketController.createTicket,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware([UserRole.ADMIN]),
      validationMiddleware(CreateTicketDto, 'body', true),
      this.ticketController.updateTicket,
    );
    this.router.post(`${this.path}/purchase/:id`, authMiddleware, roleMiddleware([UserRole.USER]), this.ticketController.purchaseTicket);
  }
}

export default TicketRoute;
