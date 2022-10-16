import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateMeDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
    @IsOptional()
    @ApiProperty()
    @IsString()
    address?: string;
    @ApiProperty()
    @IsOptional()
    avatar?: any;
    @ApiProperty()
    @IsOptional()
    language: string;
}
