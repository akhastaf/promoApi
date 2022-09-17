import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { CheckAbilities } from 'src/casl/decorators/abilities.decorator';
import { Actions } from 'src/casl/casl-ability.factory';
import { Promotion } from './entities/promotion.entity';
import { AbilitiesGuards } from 'src/casl/guards/abilies.guard';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  create(@Req() req: RequestWithAuth,@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto, req.user);
  }

  @Get()
  findAll(@Req() req: RequestWithAuth,) {
    return this.promotionService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionService.update(id, updatePromotionDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AbilitiesGuards)
  @CheckAbilities({ actions: Actions.Delete, subjects: Promotion })
  remove(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.remove(id);
  }
}
