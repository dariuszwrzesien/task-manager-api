import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  loginErrorHandler,
  repositoryErrorHandler,
} from '../common/handlers/error.handler';
import {
  comparePassword,
  hashPassword,
} from '../common/handlers/hash-password.handler';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = this.create(authCredentialsDto);
    try {
      const user = this.create({
        username,
        password: await hashPassword(password),
      });
      await this.save(user);
    } catch (error) {
      throw repositoryErrorHandler(error, {
        conflict: 'Username already exists',
      });
    }
  }
}
