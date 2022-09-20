import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PromotionModule } from './promotion/promotion.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { CaslModule } from './casl/casl.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
            // I18nModule.forRoot({
            //   fallbackLanguage: 'en',
            //   loaderOptions: {
            //     path: join(__dirname, '/i18n'),
            //     watch: true,
            //   },
            //   loader: I18nJsonLoader
            // }),
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'client'),
            }),
            TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
            AuthModule,
            UserModule,
            PromotionModule,
            CaslModule,
            MailModule
            ],
  controllers: [],
  providers: [],
})
export class AppModule {}
