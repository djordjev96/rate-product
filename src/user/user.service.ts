import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findUserByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async createUser(email: string) {
    const user = this.repo.create({ email });

    return await this.repo.save(user);
  }

  async configureUsername(username: string, user: User) {
    const userExist = await this.repo.findOne({ where: { email: user.email } });

    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    user.username = username;

    return await this.repo.save(user).catch((e) => {
      if (e.code === 'SQLITE_CONSTRAINT' || e.code === '23505') {
        throw new BadRequestException(
          'Account with this username already exists.',
        );
      }
      return e;
    });
  }
}
