import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { AbilitiesGuards } from 'src/casl/guards/abilies.guard';
import { CheckAbilities } from 'src/casl/decorators/abilities.decorator';
import { Actions } from 'src/casl/casl-ability.factory';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { User } from './entities/user.entity';
import { CustomerService } from './customer.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AbilitiesGuards)
  @CheckAbilities({ actions: Actions.Create, subjects: User})
  @Post()
  create(@Req() req: RequestWithAuth ,@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AbilitiesGuards)
  @CheckAbilities({ actions: Actions.Read, subjects: User})
  @Get()
  findAll(@Req() req: RequestWithAuth ,) {
    return this.userService.findAll(req.user);
  }
  
  @UseGuards(AbilitiesGuards)
  @CheckAbilities({ actions: Actions.ReadOne, subjects: User})
  @Get(':id')
  findOne(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  
  @UseGuards(AbilitiesGuards)
  @CheckAbilities({ actions: Actions.Upadate, subjects: User})
  @Patch(':id')
  update(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  
  @UseGuards(AbilitiesGuards)
  @CheckAbilities({ actions: Actions.Delete, subjects: User})
  @Delete(':id')
  remove(@Req() req: RequestWithAuth ,@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // Customer
  @Get('customer/join/:id')
  async join(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.join(id, req.user);
  }

  @Get('customer/promotions')
  async getPromotions(@Req() req: RequestWithAuth): Promise<Promotion[]> {
    return await this.userService.getPromotions(req.user);
  }
  @Get('customer/managers')
  async getmanagers(@Req() req: RequestWithAuth): Promise<User[]> {
    return await this.userService.getManagers(req.user);
  }

  // Manager
  @Get('manager/customers')
  async getAllCustomers(@Req() req: RequestWithAuth) : Promise<User[]> {
    return await this.userService.getAllCustomers(req.user);
  }
}
