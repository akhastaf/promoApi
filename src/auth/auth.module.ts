import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtModule } from './jwtModule';
import { UserModule } from 'src/user/user.module';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [jwtModule, ConfigModule, UserModule, TwilioModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (cfg: ConfigService) => ({
      accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
      authToken: cfg.get('TWILIO_AUTH_TOKEN'),
    }),
  })],
  providers: [AuthService, JWTStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
