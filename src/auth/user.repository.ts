import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { repositoryErrorHandler } from '../common/handlers/repository-error.handler';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userData: AuthCredentialsDto): Promise<void> {
    const user = this.create(userData);
    try {
      await this.save(user);
    } catch (error) {
      throw repositoryErrorHandler(error, {
        conflict: 'Username already exists',
      });
    }
  }
}
