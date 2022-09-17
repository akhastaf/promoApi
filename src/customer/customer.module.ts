import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { jwtModule } from 'src/auth/jwtModule';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { User } from 'src/user/entities/user.entity';
import { PromotionModule } from 'src/promotion/promotion.module';

@Module({
  imports: [UserModule, PromotionModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
