import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { loginErrorHandler } from '../common/handlers/error.handler';
import { comparePassword } from '../common/handlers/hash-password.handler';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

//Business logic for authentication

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw loginErrorHandler();
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw loginErrorHandler();
    }

    const payload: JwtPayload = { username: authCredentialsDto.username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
