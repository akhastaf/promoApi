import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { ResetDTO } from './dto/reset.dto';
import { ForgetDto } from './dto/forget.dto';
import { MailService } from 'src/mail/mailService';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class AuthService {
    private logger: Logger = new Logger(AuthService.name);

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

    login(user: User): any {
        const payload = { email: user.email, sub: user.id };
        return { access_token: this.jwtService.sign(payload),
                refrsh_token: this.jwtService.sign(payload, {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: '3m'
                }) };
    }

    async getAccess_token(refrsh_token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refrsh_token, {
                secret: this.configService.get('JWT_SECRET'),
                ignoreExpiration: false
            });
            const user = await this.userService.findOneByEmail(payload.eamil);
            return this.login(user);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    async register(registerCustomerDto: RegisterCustomerDto, i18n : I18nContext) : Promise<User> {
        return this.userService.create(registerCustomerDto ,i18n);
    }

    async forget(forgetDto: ForgetDto) {
        try {
            const user = await this.userService.generateToken(forgetDto.eamil);
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
