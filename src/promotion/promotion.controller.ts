import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithAuth } from 'src/types';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
// import { CheckAbilities } from 'src/casl/decorators/abilities.decorator';
import { Actions, AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Promotion } from './entities/promotion.entity';
// import { AbilitiesGuards } from 'src/casl/guards/abilies.guard';
import { ForbiddenError } from '@casl/ability';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService,
              private readonly abilityFactory: CaslAbilityFactory) {}

  @Post()
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({actions: Actions.Create, subjects: Promotion})
  create(@Req() req: RequestWithAuth,@Body() createPromotionDto: CreatePromotionDto) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.create(createPromotionDto, req.user, ability);
  }
  
  @Get()
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({actions: Actions.Read, subjects: Promotion})
  findAll(@Req() req: RequestWithAuth,) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.findAll(req.user, ability);
  }
  
  @Get(':id')
  async findOne(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return await this.promotionService.findOne(id, req.user, ability);
  }
  
  @Patch(':id')
  // @UseGuards(AbilitiesGuards)
  // @CheckAbilities({actions: Actions.Upadate, subjects: Promotion})
  async update(@Req() req: RequestWithAuth, @Param('id', ParseIntPipe) id: number, @Body() updatePromotionDto: UpdatePromotionDto) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.update(id, updatePromotionDto, req.user, ability);
  }
      
  @Delete(':id')
      // @UseGuards(AbilitiesGuards)
      // @CheckAbilities({ actions: Actions.Delete, subjects: Promotion })
  remove(@Req() req: RequestWithAuth,@Param('id', ParseIntPipe) id: number) {
    const ability = this.abilityFactory.defineAbility(req.user);
    return this.promotionService.remove(id, ability);
  }
}
