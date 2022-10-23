import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { JWTGuard } from './guardes/jwt.guard';
import { LogGuard } from './guardes/log.guards';

@ApiTags('Auth')
@UseGuards(LogGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/auth')
export class AuthController {
    constructor (private authService: AuthService, private configService: ConfigService) {}

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req: RequestWithAuth , @Res() res: Response,@Body() loginUserDto: LoginUserDto) {
        console.debug(loginUserDto);
        const tokens: any = await this.authService.login(req.user);
        const expireIn = new Date();
        expireIn.setMonth(expireIn.getMonth() + 3);
        res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, expires: expireIn });
        const { password, token, ...salesman} = tokens.user.salesman;
        tokens.user.salesman = salesman;
        res.send({ user: tokens.user, access_token: tokens.access_token });
    }

    @UseGuards(JWTGuard)
    @Delete('logout')
    async logout(@Req() req: RequestWithAuth , @Res() res: Response) : Promise<void> {
        res.clearCookie('refresh_token');
        res.status(200).send();
    }

    @Get('refresh_token')
    async getAccess_token(@Req() req: Request, @Res() res: Response) {
        if ('refresh_token' in req.cookies)
        {
            const expireIn = new Date();
            expireIn.setMonth(expireIn.getMonth() + 3);
            const tokens = await this.authService.getAccess_token(req.cookies['refresh_token']);
            res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, expires: expireIn })
            res.send({ access_token: tokens.access_token });
        }
        throw new UnauthorizedException('refresh_token not exist')
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
            // console.log(resetDto.)
            await this.authService.reset(token, resetDto);
            res.status(200).send();
            //res.redirect(`${this.configService.get('CLIENT_HOST')}/login`)
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

}
