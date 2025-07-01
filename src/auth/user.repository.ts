import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { repositoryErrorHandler } from '../common/handlers/error.handler';
import { hashPassword } from '../common/handlers/hash-password.handler';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
  private readonly logger = new Logger(UsersRepository.name, {
    timestamp: true,
  });

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
      this.logger.debug(`User ${username} created successfully.`);
    } catch (error) {
      throw repositoryErrorHandler(error, {
        conflict: 'Username already exists',
      });
    }
  }
}
