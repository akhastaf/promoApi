import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AuthService {
    private logger: Logger = new Logger(AuthService.name);

    constructor (private configService: ConfigService,
            private userService: UserService,
            private customerService: CustomerService,
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
    
    async validateCustomer(email: string, phone: string): Promise<Customer> {
        const customer = await this.customerService.findOneByEmail(email);
        if (customer)
        {
            if (customer.phone === phone)
                return customer;
        }
        return null;
    }

    login(user: User): any {
        const payload = { email: user.email, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
    
    loginCustomer(customer: Customer): any {
        const payload = { email: customer.email, sub: customer.id };
        return { access_token: this.jwtService.sign(payload) };
    }
}
