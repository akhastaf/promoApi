import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";

export const mailerModule = MailerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
        transport: {
            host: configService.get('SMTP_HOST'),  
            secureConnection: configService.get('SMTP_SECURE') === 'true' ? true : false,
            port: parseInt(configService.get('SMTP_PORT')),
            auth: {
              user: configService.get('SMTP_USER'),
              pass: configService.get('SMTP_PASSWORD'),
            },
        },
        defaults: {
            from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
                strict: true,
            },
        },
    })
})