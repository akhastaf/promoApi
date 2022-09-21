import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, Param, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private configService: ConfigService) {}

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req: RequestWithAuth , @Res() res: Response,@Body() loginUserDto: LoginUserDto) {
        const tokens = this.authService.login(req.user);
        res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
        res.send({ user: req.user, access_token: tokens.access_token });
        return { user: req.user, access_token: tokens.access_token };
    }

    @Post('register')
    async register(@Body() registerCustomerDto: RegisterCustomerDto, @I18n() i18n: I18nContext): Promise<User> {
        return await this.authService.register(registerCustomerDto, i18n);
    }

    @Get('refresh_token')
    async getAccess_token(@Req() req: Request) {
        if ('refresh_token' in req.cookies)
            return this.authService.getAccess_token(req.cookies['refresh_token']);
        throw new ForbiddenException('refresh_token not exist')
    }
    
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
