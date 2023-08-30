import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { LoginPayload } from './models/LoginPayload';

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
    const { id, name, email } = data;

    const payload = { name, email, sub: id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
