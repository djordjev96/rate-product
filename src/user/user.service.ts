import { Injectable } from '@nestjs/common';
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
    const user = await this.repo.create({ email, role: 'user' });

    return await this.repo.save(user);
  }
}
