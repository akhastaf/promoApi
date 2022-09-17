import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PromotionModule } from './promotion/promotion.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
            TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
            AuthModule,
            UserModule,
            PromotionModule,
            CaslModule
            ],
  controllers: [],
  providers: [],
})
export class AppModule {}
