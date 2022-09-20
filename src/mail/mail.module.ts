import { Global, Module } from '@nestjs/common';
import { mailerModule } from './mailerModule';
import { MailService } from './mailService';

@Global()
@Module({
    imports: [mailerModule],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
