import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Contains, IsBoolean, IsBooleanString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Max, Min } from 'class-validator';
import { Match } from '../decorators/match.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateMeSecurityDto {
    @ApiProperty()
    @IsOptional()
    // @IsString()
    // @Min(8)
    // @Max(20)
    // // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password?: string;
    @ApiProperty()
    @IsOptional()
    // @IsString()
    // @Min(8)
    // @Max(20)
    // // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    new_password?: string;
    @ApiProperty()
    @IsOptional()
    // @IsString()
    // // @IsNotEmpty()
    // @Min(8)
    // @Max(20)
    @Match("new_password", {message: 'repeat password must be idenitcal to new password'})
    password_confirmation: string;
}
