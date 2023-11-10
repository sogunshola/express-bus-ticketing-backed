import { RequestHandler } from 'express';
import { UserRole } from '../interfaces/users.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

// middleware to check if the user is authorized to access a particular route by checking the user's role.
const roleMiddleware = (roles: UserRole[]): RequestHandler => {
  return (req: RequestWithUser, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};

export default roleMiddleware;
