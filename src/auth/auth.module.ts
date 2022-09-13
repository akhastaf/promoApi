import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtModule } from './jwtModule';
import { UserModule } from 'src/user/user.module';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
// import { JWTGuardForCustomer } from './guardes/jwt.guard';
// import { LocalGuardForCustomer } from './guardes/local.guard';
import { CustomerModule } from 'src/customer/customer.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalGuardForCustomer } from './guardes/local.guard';
import { JWTGuardForCustomer } from './guardes/jwt.guard';

@Module({
  imports: [jwtModule, UserModule, CustomerModule],
  providers: [AuthService, JWTStrategy, LocalStrategy, LocalGuardForCustomer, JWTGuardForCustomer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
