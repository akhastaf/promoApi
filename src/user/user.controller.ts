import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, ParseIntPipe, UploadedFile, Query, DefaultValuePipe, Res, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { AbilitiesGuards } from 'src/casl/guards/abilies.guard';
import { CheckAbilities } from 'src/casl/decorators/abilities.decorator';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { User, UserRole } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/promotion/pipes/sharp.pipe';
import { Pagination } from 'nestjs-typeorm-paginate';
import { I18n, I18nContext } from 'nestjs-i18n';
import { LogGuard } from 'src/auth/guardes/log.guards';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMeSecurityDto } from './dto/update-me-security.dto';
import { Response } from 'express';

@ApiTags('Users')
@ApiBearerAuth()

@UseGuards(LogGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
              
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'string',
        },
        email: {
          type: 'string',
          format: 'string',
        },
        phone: {
          type: 'string',
          format: 'string',
        },
        address: {
          type: 'string',
          format: 'string',
        },
        password: {
          type: 'string',
          format: 'string',
        },
        password_confirmation: {
          type: 'string',
          format: 'string',
        },
        role: {
          type: 'string',
          format: 'string',
        },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JWTGuard)
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Req() req: RequestWithAuth, @UploadedFile(SharpPipe) avatar: string, @Body() createUserDto: CreateUserDto,
    @I18n() i18n: I18nContext)
  {
    if (avatar)
      createUserDto.avatar = avatar;
    return this.userService.create(createUserDto, req.user, i18n);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'string',
        },
        phone: {
          type: 'string',
          format: 'string',
        },
        address: {
          type: 'string',
          format: 'string',
        },
        avatar: {
          type: 'string',
          format: 'binary',
        },
        language: {
          type: 'string',
          format: 'binary',
        }
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JWTGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  updateMe(@Req() req: RequestWithAuth ,
        @UploadedFile(SharpPipe) avatar: string,
        @Body() upadateMeDto: UpdateMeDto) {
    if (avatar)
      upadateMeDto.avatar = avatar;
    return this.userService.updateMe(req.user, upadateMeDto);
  }

  @UseGuards(JWTGuard)
  @Patch('me/security')
  updateMeSecurity(@Req() req: RequestWithAuth ,
        @Body() updateMeDto: UpdateMeSecurityDto) {
    return this.userService.updateMeSecurity(req.user, updateMeDto);
  }

  @UseGuards(JWTGuard)
  @Get('me')
  me(@Req() req: RequestWithAuth) {
    return this.userService.me(req.user);
  }
  @UseGuards(JWTGuard)
  @Get('qr')
  async getQr(@Req() req: RequestWithAuth, @Res() res: Response) {
    if (req.user.role != UserRole.STORE)
      throw new ForbiddenException('you are not store');
    const doc  = await this.userService.getQr(req.user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${req.user.name}.pdf`,
      'Content-Length': doc.length,
    })
    res.end(doc)
  }

  @UseGuards(JWTGuard)
  @Get()
  findAll(@Req() req: RequestWithAuth,
      @Query('order') order: string,
      @Query('role', new DefaultValuePipe(UserRole.ALL)) role: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) : Promise<Pagination<User>>
  {
    limit = limit > 100 ? 100 : limit;
    order = order ?? 'email';
    return this.userService.findAll(req.user, { limit, page }, role, order);
  }
  
  // @UseGuards(JWTGuard)
  @Get(':id')
  findOne(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'string',
        },
        phone: {
          type: 'string',
          format: 'string',
        },
        address: {
          type: 'string',
          format: 'string',
        },
        avatar: {
          type: 'string',
          format: 'binary',
        },
        isActive: {
          type: 'boolean',
          format: 'boolean'
        }
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JWTGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Req() req: RequestWithAuth ,
        @UploadedFile(SharpPipe) avatar: string,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto) {
    if (avatar)
      updateUserDto.avatar = avatar;
    return this.userService.update(id, updateUserDto, req.user);
  }
  
  @UseGuards(JWTGuard)
  @Delete(':id')
  remove(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id, req.user);
  }

  
  
}