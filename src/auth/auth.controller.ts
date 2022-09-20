import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Param, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { User } from 'src/user/entities/user.entity';
import { LocalGuard } from './guardes/local.guard';
import { RequestWithAuth } from 'src/types';
import { ResetDTO } from './dto/reset.dto';
import { ForbiddenError } from '@casl/ability';
import { ForgetDto } from './dto/forget.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private configService: ConfigService) {}

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req: RequestWithAuth ,@Body() loginUserDto: LoginUserDto) {
        return { user: req.user, access_token: this.authService.login(req.user) };
    }

    // @Post('register')
    // async register(@Body() registerCustomerDto: RegisterCustomerDto): Promise<User> {
    //     return await this.authService.register(registerCustomerDto);
    // }
    
    @Post('forget')
    async forget(@Body() forgetDto: ForgetDto) {
        return await this.authService.forget(forgetDto);
    }
    @ApiQuery({
        name: 'token',
        type: 'string'
    })
    @Post('reset')
    async reset(@Res() res: Response,@Query('token') token: string, @Body() resetDto: ResetDTO) {
        try {
            await this.authService.reset(token, resetDto);
            //res.redirect(`${this.configService.get('CLIENT_HOST')}/login`)
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

}
