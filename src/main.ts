import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService : ConfigService = app.get(ConfigService);
  app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.enableCors({
    origin: configService.get('CLIENT_HOST'),
    credentials: true,
  })
  console.log(configService.get('CLIENT_HOST'));
  app.use(cookieParser());
  const config = new DocumentBuilder()
                 .setTitle('Promotion API')
                 .setDescription('promotion app')
                 .setVersion('1.0')
                 .addBearerAuth()
                 .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(parseInt(configService.get('PORT')));
}
bootstrap();
