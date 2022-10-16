import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, ParseIntPipe, UploadedFile, Query, DefaultValuePipe } from '@nestjs/common';
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

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@UseGuards(LogGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly abilityFactory: CaslAbilityFactory) {}
              
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
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Req() req: RequestWithAuth,
  @UploadedFile(SharpPipe) avatar: string,
  @Body() createUserDto: CreateUserDto,
  @I18n() i18n: I18nContext) {
    if (avatar)
    createUserDto.avatar = avatar;
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.create(createUserDto, i18n, ability);
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
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  updateMe(@Req() req: RequestWithAuth ,
        @UploadedFile(SharpPipe) avatar: string,
        @Body() upadateMeDto: UpdateMeDto) {
    if (avatar)
    upadateMeDto.avatar = avatar;
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.updateMe(req.user, upadateMeDto, ability);
  }
  @Patch('me/security')
  updateMeSecurity(@Req() req: RequestWithAuth ,
        @Body() updateMeDto: UpdateMeSecurityDto) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.updateMeSecurity(req.user, updateMeDto, ability);
  }
  @Get('me')
  me(@Req() req: RequestWithAuth) {
    return this.userService.me(req.user);
  }

  @Get()
  findAll(@Req() req: RequestWithAuth,
      @Query('order') order: string,
      @Query('role', new DefaultValuePipe(UserRole.ALL)) role: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) : Promise<Pagination<User>>
  {
    limit = limit > 100 ? 100 : limit;
    order = order ?? 'email';
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.findAll(req.user, { limit, page }, role, order, ability);
  }
  
  @Get(':id')
  findOne(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.findOne(id, ability);
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
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Req() req: RequestWithAuth ,
        @UploadedFile(SharpPipe) avatar: string,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto) {
    if (avatar)
      updateUserDto.avatar = avatar;
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.update(id, updateUserDto, ability);
  }
  
  
  @Delete(':id')
  remove(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.remove(id, ability);
  }

  
  // // Customer
  // @Get('subscribe/:id')
  // async subscribe(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number): Promise<User> {
  //   const ability = this.abilityFactory.defineAbility(req.user);
  //   return await this.userService.subscribe(id, req.user, ability);
  // }
  // @Get('unsubscribe/:id')
  // async unsubscribe(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number): Promise<any> {
  //   const ability = this.abilityFactory.defineAbility(req.user);
  //   return await this.userService.unsubscribe(id, req.user, ability);
  // }
}