import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Response, Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = {
      userId: req.user['userId'],
      name: req.user['name'],
      email: req.user['email'],
    };

    const { refreshToken, accessToken } = await this.authService.login(data);

    res.cookie('refreshToken', refreshToken, {
      sameSite: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 Week
    });

    return {
      accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refresh(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = {
      userId: req.user['userId'],
      name: req.user['name'],
      email: req.user['email'],
    };

    const { refreshToken, accessToken } =
      await this.authService.refreshToken(data);

    res.cookie('refreshToken', refreshToken, {
      sameSite: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 Week
    });

    return {
      accessToken,
    };
  }
}
