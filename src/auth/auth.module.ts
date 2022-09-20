import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtModule } from './jwtModule';
import { UserModule } from 'src/user/user.module';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [jwtModule, ConfigModule, UserModule],
  providers: [AuthService, JWTStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
