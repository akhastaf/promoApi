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
import { MailModule } from './mail/mail.module';
import { CookieResolver, I18nModule, I18nYamlLoader, QueryResolver } from 'nestjs-i18n';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
            I18nModule.forRoot({
              fallbackLanguage: 'fr',
              fallbacks: { 'en': 'en', 'fr': 'fr'},
              loaderOptions: {
                path: join(__dirname, '/i18n/'),
                watch: true,
              },
              resolvers: [
                new QueryResolver(['lang', 'l'])
              ]
            }),
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'client'),
            }),
            TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
            AuthModule,
            UserModule,
            PromotionModule,
            CaslModule,
            MailModule,
            CustomerModule
            ],
  controllers: [],
  providers: [],
})
export class AppModule {}
