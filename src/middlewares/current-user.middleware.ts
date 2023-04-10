import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: any;
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.user.email || {};

    if (email) {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        const newUser = await this.usersService.createUser(email);
        req.currentUser = newUser;
      } else {
        req.currentUser = user;
      }
    }

    next();
  }
}
