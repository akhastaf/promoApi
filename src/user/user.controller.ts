import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { AbilitiesGuards } from 'src/casl/guards/abilies.guard';
import { CheckAbilities } from 'src/casl/decorators/abilities.decorator';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { User } from './entities/user.entity';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly abilityFactory: CaslAbilityFactory) {}

  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({ actions: Actions.Create, subjects: User})
  @Post()
  create(@Req() req: RequestWithAuth ,@Body() createUserDto: CreateUserDto) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.create(createUserDto, ability);
  }
  
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({ actions: Actions.Read, subjects: User})
  @Get()
  findAll(@Req() req: RequestWithAuth ,) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.findAll(req.user, ability);
  }
  
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({ actions: Actions.ReadOne, subjects: User})
  @Get(':id')
  findOne(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.findOne(id, ability);
  }
  
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({ actions: Actions.Upadate, subjects: User})
  @Patch(':id')
  update(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.update(id, updateUserDto, ability);
  }
  
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({ actions: Actions.Delete, subjects: User})
  @Delete(':id')
  remove(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.userService.remove(id, ability);
  }
  
  // Customer
  @Get('customer/subscribe/:id')
  async subscribe(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number): Promise<User> {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.userService.subscribe(id, req.user, ability);
  }
  @Get('customer/unsubscribe/:id')
  async unsubscribe(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number): Promise<any> {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.userService.unsubscribe(id, req.user, ability);
  }
  
  @Get('customer/promotions')
  async getPromotions(@Req() req: RequestWithAuth): Promise<Promotion[]> {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.userService.getPromotions(req.user, ability);
  }
  @Get('customer/managers')
  async getmanagers(@Req() req: RequestWithAuth): Promise<User[]> {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.userService.getManagers(req.user, ability);
  }
  
  // Manager
  @Get('manager/customers')
  async getAllCustomers(@Req() req: RequestWithAuth) : Promise<User[]> {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.userService.getAllCustomers(req.user, ability);
  }
}