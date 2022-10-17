import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, 
                private configService: ConfigService) {}

    async sendReset(user: User) : Promise<void> {
        const url = `${this.configService.get('CLIENT_HOST')}/reset?token=${user.token}`;
        this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset your password',
            template: './reset',
            context: {
                name: user.name,
                url,
            }
        });
    }
    async sendStoreCreation(email: string, password: string, name: string) : Promise<void> {
        this.mailerService.sendMail({
            to: email,
            subject: 'Reset your password',
            template: './newStore',
            context: {
                email,
                password,
                name,
            }
        });
    }
}