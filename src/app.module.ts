import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PromotionModule } from './promotion/promotion.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { CaslModule } from './casl/casl.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'client'),
            }),
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
