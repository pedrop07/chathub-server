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

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await compare(password, user.password_hash);

    if (passwordMatches) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials.');
  }

  async login({ userId, username, email }: LoginPayload) {
    const jwtPayload = { username, email, sub: userId };

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken({ userId, username, email }: RefreshTokenPayload) {
    await this.userService.findByIdOrFail(userId);

    const jwtPayload = { sub: userId, username, email };

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
