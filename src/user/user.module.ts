import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { CaslModule } from 'src/casl/casl.module';
import { CustomerService } from './customer.service';
import { PromotionModule } from 'src/promotion/promotion.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Promotion]), CaslModule, PromotionModule],
  controllers: [UserController],
  providers: [UserService, CustomerService],
  exports: [UserService]
})
export class UserModule {}
