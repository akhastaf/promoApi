import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JWTGuard, JWTGuardForCustomer } from 'src/auth/guardes/jwt.guard';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { RequestWithAuth, RequestWithCustomer } from 'src/types';
import { UserService } from 'src/user/user.service';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }
  
  @UseGuards(JWTGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Req() req: RequestWithAuth) {
    return this.customerService.findAll(req.user);
  }
  
  @UseGuards(JWTGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOne(id, req.user);
  }
  
  @UseGuards(JWTGuardForCustomer)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Req() req: RequestWithCustomer, @Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto, req.user);
  }
  
  @UseGuards(JWTGuardForCustomer)
  @ApiBearerAuth()
  @Post('join/:id')
  async join(@Req() req: RequestWithCustomer, @Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.customerService.join(id, req.user);
  }
  
  // @UseGuards(JWTGuardForCustomer)
  // @Get('promotion')
  // async getAllPromotions(@Req() req: RequestWithCustomer) : Promise<Promotion[]> {
  //   return await this.customerService.getAllPromotions(req.customer);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.customerService.remove(id);
  // }
}
