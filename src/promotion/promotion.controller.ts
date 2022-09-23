import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, ForbiddenException, UploadedFile, Query, DefaultValuePipe } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { Actions, AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Promotion } from './entities/promotion.entity';
import { ForbiddenError } from '@casl/ability';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from './pipes/sharp.pipe';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CheckAbilities } from 'src/casl/decorators/abilities.decorator';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService,
              private readonly abilityFactory: CaslAbilityFactory) {}

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
    createPromotionDto.image = image;
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.create(createPromotionDto, req.user, ability);
  }
  
  @Get()
  findAll(@Req() req: RequestWithAuth,
          @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
          @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) : Promise<Pagination<Promotion>>
  {
    limit = limit > 100 ? 100 : limit;  
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.findAll(req.user, { limit, page }, ability);
  }
  
  @Get(':id')
  async findOne(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.promotionService.findOne(id, req.user, ability);
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
  async update(@Req() req: RequestWithAuth,
              @UploadedFile(SharpPipe) image: string,
              @Param('id', ParseIntPipe) id: number,
              @Body() updatePromotionDto: UpdatePromotionDto) {
    if (image)
      updatePromotionDto.image = image;
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.update(id, updatePromotionDto, req.user, ability);
  }
      
  @Delete(':id')
  remove(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.remove(id, ability);
  }
}
