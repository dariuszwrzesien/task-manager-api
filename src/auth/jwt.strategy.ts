import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './user.repository';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { User } from './user.entity';
import { loginErrorHandler } from '../common/handlers/error.handler';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: (req) => ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      secretOrKey: 'your_jwt_secret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user: User | null = await this.usersRepository.findOneBy({
      username: payload.username,
    });

    if (!user) {
      throw loginErrorHandler();
    }

    return user;
  }
}
