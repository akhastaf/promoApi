import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, DefaultValuePipe, Query, UseGuards, Req, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { LogGuard } from 'src/auth/guardes/log.guards';
import { RequestWithAuth } from 'src/types';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('Customers')
@UseGuards(LogGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post(':id')
  async create(@Param('id', ParseIntPipe) id:number, @Body() createCustomerDto: CreateCustomerDto) {
    console.log(createCustomerDto);
    return await this.customerService.create(id, createCustomerDto);
  }

  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get()
  async findAll(@Req() req: RequestWithAuth,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10)
  {
    return await this.customerService.findAll({ limit, page }, req.user);
  }
  
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get(':id')
  async findAllForStore(@Param('id', ParseIntPipe) id: number, 
                @Req() req: RequestWithAuth,
                @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10)
  {
    return await this.customerService.findAllForStore(id, { limit, page }, req.user);
  }
  
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithAuth) {
    return await this.customerService.remove(id, req.user);
  }
}
