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

@Injectable()
export class AuthService {

    constructor (private configService: ConfigService,
            private userService: UserService,
            private mailService: MailService,
            private jwtService: JwtService
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
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: '90d'
                })};
    }

    async getAccess_token(refrsh_token: string) {
        try {
            const payload: Payload = await this.jwtService.verifyAsync(refrsh_token, {
                secret: this.configService.get('JWT_SECRET'),
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
    
}
