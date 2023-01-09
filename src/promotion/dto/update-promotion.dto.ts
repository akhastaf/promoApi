import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreatePromotionDto } from './create-promotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
    @ApiPropertyOptional()
    image?: any;
}
