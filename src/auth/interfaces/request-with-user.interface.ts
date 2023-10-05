import { Request as ExpressRequest } from 'express';

interface User {
  userId: string;
  username: string;
  email: string;
}

export interface RequestWithUser extends ExpressRequest {
  user: User;
}
