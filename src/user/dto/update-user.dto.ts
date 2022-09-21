import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Contains, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Match } from '../decorators/match.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;
    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phone?: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    address?: string;
    // @ApiProperty()
    // @IsString()
    // @IsOptional()
    // @IsNotEmpty()
    // @Min(8)
    // @Max(20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    // old_password?: string;
    // @ApiProperty()
    // @IsOptional({

    // })
    // new_password?: string;
    // @ApiProperty()
    // @IsString()
    // @IsOptional()
    // // @IsNotEmpty()
    // // @Min(8)
    // // @Max(20)
    // @Match("new_password", {message: 'repeat password must be idenitcal to new password'})
    // password_confirmation?: string;
    @ApiProperty()
    avatar: any;
}
