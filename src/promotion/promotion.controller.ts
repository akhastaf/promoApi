import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { Promotion } from './entities/promotion.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LogGuard } from 'src/auth/guardes/log.guards';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(LogGuard)
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  create(@Req() req: RequestWithAuth, @Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto, req.user);
  }
  
  @Get()
  findAll(@Req() req: RequestWithAuth,
          @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
          @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) : Promise<Pagination<Promotion>>
  {
    limit = limit > 100 ? 100 : limit;
    return this.promotionService.findAll(req.user, { limit, page });
  }
  
  @Get(':id')
  async findAllForStore(@Req() req: RequestWithAuth,
            @Param('id', ParseIntPipe) id: number,
            @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
            @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) {
    return await this.promotionService.findAllForStore(id, { limit, page }, req.user);
  }
  
  @Patch(':id')
  async update(@Req() req: RequestWithAuth,
              @Param('id', ParseIntPipe) id: number,
              @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionService.update(id, updatePromotionDto, req.user);
  }
      
  @Delete(':id')
  remove(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.remove(id, req.user);
  }
}
