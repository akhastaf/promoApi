import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, Query, DefaultValuePipe, UploadedFile } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { Promotion } from './entities/promotion.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LogGuard } from 'src/auth/guardes/log.guards';
import { image } from 'pdfkit';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from './pipes/sharp.pipe';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(LogGuard)
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiConsumes('multipart/form-data')
@Controller('api/promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          format: 'string',
        },
        description: {
          type: 'string',
          format: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Req() req: RequestWithAuth, @UploadedFile(SharpPipe) image: string, @Body() createPromotionDto: CreatePromotionDto) {
    if (image)
      createPromotionDto.image = image;
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
  
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          format: 'string',
        },
        description: {
          type: 'string',
          format: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(@Req() req: RequestWithAuth,
              @Param('id', ParseIntPipe) id: number,
              @UploadedFile(SharpPipe) image: string,
              @Body() updatePromotionDto: UpdatePromotionDto) {
    if (image)
      updatePromotionDto.image = image;
    return this.promotionService.update(id, updatePromotionDto, req.user);
  }
      
  @Delete(':id')
  remove(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.remove(id, req.user);
  }
}
