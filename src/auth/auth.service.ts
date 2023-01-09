import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { ResetDTO } from './dto/reset.dto';
import { ForgetDto } from './dto/forget.dto';
import { MailService } from 'src/mail/mailService';
import { Payload } from 'src/types';
import { TwilioService } from 'nestjs-twilio';
import { Twilio } from 'twilio';

@Injectable()
export class AuthService {

    constructor (private configService: ConfigService,
            private userService: UserService,
            private mailService: MailService,
            private jwtService: JwtService,
            private twilioService: TwilioService,
        ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findOneByEmail(email);
        if (user)
        {
            if (await bcrypt.compare(password, user.password))
            return user;
        }
        return null;
    }

    async login(user: User): Promise<any> {
        const payload = { email: user.email, sub: user.id };
        const {password, token, ...user1} = user; 
        return { user: user1, access_token: this.jwtService.sign(payload),
                refresh_token: this.jwtService.sign(payload, {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: '90d'
                })};
    }

    async getAccess_token(refrsh_token: string) {
        try {
            const payload: Payload = await this.jwtService.verifyAsync(refrsh_token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                ignoreExpiration: false
            });
            const user = await this.userService.findOneByEmail(payload.email);
            return this.login(user);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    async forget(forgetDto: ForgetDto) {
        try {
            const user = await this.userService.generateToken(forgetDto.email);
            await this.mailService.sendReset(user);
            return { msg: 'success'};
        } catch (error) {
            if (error instanceof BadRequestException)
                throw new BadRequestException(error.message);
            throw new ForbiddenException();
        }
    }
    async reset(token: string, resetDto: ResetDTO) {
        try {
            await this.userService.reset(token, resetDto);
            return { msg: 'suscess'};
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
    
    async createNumber() {
        let number : string;
        let number_sid : string = 'PNc1d6221d6db3dcd06854d8a931d367c9';
        let service_name : string;
        let service_id : string;
        let notify_name : string;
        let notify_id : string;
        const client = new Twilio(this.configService.get('TWILIO_ACCOUNT_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
        await client.availablePhoneNumbers('US').local.list({ areaCode: 516, limit: 1 }).then(async local => {
            console.log(local);
            if (local.length) {
                number = local[0].phoneNumber;
                console.log('number', number);
                await client.incomingPhoneNumbers
                .create({phoneNumber: number})
                .then(incoming_phone_number => { 
                    console.log(incoming_phone_number);
                });
                // await client.messaging.v1.services.create({ friendlyName: `store_3_service`, usecase: 'notifications'}).then( async service => {
                //     console.log('service ', service);
                //     service_id = service.sid;
                //     service_name = service.friendlyName;
                //     await client.messaging.v1.services(service.sid)
                //     .phoneNumbers
                //     .create({
                //         phoneNumberSid: number_sid
                //         })
                //     .then(phone_number => console.log(phone_number.sid));
                //     await client.notify.v1.services.create({ friendlyName: `store_3_notify`, messagingServiceSid: service_id}).then(service =>  {
                //         console.log('notify ', service);
                //         notify_name = service.friendlyName;
                //         notify_id = service.sid;
                //     });
                // });
            }

        });
        // const services = ['MG42faddf0955797094feea15788c7ac35', 'MGd6756aecbd836a270e388bfc7321c3c8'];
        // services.forEach(async s => {

        //     const t = await client.messaging.v1.services(s).remove();
        //     console.log(t);
        // })
        return { number, number_sid, service_name, service_id, notify_name, notify_id };
    }
}
