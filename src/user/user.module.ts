import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { CaslModule } from 'src/casl/casl.module';
import { PromotionModule } from 'src/promotion/promotion.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CustomerToManager } from './entities/customer_to_manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Promotion, CustomerToManager]),ConfigModule, CaslModule, PromotionModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
