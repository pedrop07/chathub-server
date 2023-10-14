import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    const loginPayload = {
      userId: req.user.userId,
      username: req.user.username,
      email: req.user.email,
    };

    const { refreshToken, accessToken } =
      await this.authService.login(loginPayload);

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refresh(@Request() req: RequestWithUser) {
    const refreshTokenPayload = {
      userId: req.user.userId,
      username: req.user.username,
      email: req.user.email,
    };

    const { refreshToken, accessToken } =
      await this.authService.refreshToken(refreshTokenPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
