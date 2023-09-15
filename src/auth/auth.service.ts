import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { LoginPayload } from './interfaces/login-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    const passwordMatches = await compare(password, user.password_hash);

    if (user && passwordMatches) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials.');
  }

  async login(data: LoginPayload) {
    const { userId, name, email } = data;
    const payload = { name, email, sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenPayload) {
    const { email, name, userId } = data;
    const payload = { sub: userId, name, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
