import { Request } from 'express';
import { Role } from './roles.enum';

export interface AuthenticatedUser {
  sub: string;
  login: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
