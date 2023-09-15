import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    WsJwtStrategy,
    WsAuthGuard,
  ],
  exports: [AuthService, PassportModule, WsAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
