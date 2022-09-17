import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { User } from 'src/user/entities/user.entity';
import { LocalGuard } from './guardes/local.guard';
import { RequestWithAuth } from 'src/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req: RequestWithAuth ,@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() registerCustomerDto: RegisterCustomerDto): Promise<User> {
        return await this.authService.register(registerCustomerDto);
    }

}
