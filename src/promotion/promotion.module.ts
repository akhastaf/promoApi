import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { CaslModule } from 'src/casl/casl.module';
import { PushService } from './push.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion]), CaslModule],
  controllers: [PromotionController],
  providers: [PromotionService/*, PushService*/],
  exports: [PromotionService]
})
export class PromotionModule {}
