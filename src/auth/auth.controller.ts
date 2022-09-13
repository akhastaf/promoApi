import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithAuth, RequestWithCustomer } from 'src/types';
import { AuthService } from './auth.service';
import { LocalGuard, LocalGuardForCustomer } from './guardes/local.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginCustomerDto } from './dto/login-customer.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req: RequestWithAuth ,@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(req.user);
    }
    @UseGuards(LocalGuardForCustomer)
    @Post('customer/login')
    async loginForCustomer(@Req() req: RequestWithCustomer ,@Body() loginCustomrDto: LoginCustomerDto) {
        return this.authService.loginCustomer(req.user);
    }

}
