import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePromotionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;
    @ApiPropertyOptional()
    image?: any;
}
