import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Contains, IsBoolean, IsBooleanString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Match } from '../decorators/match.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;
    @ApiProperty()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;
    @ApiProperty()
    avatar: any;
    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === "true")
    isActive?: boolean;
}
