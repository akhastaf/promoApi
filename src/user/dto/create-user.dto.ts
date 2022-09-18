import { ApiProperty } from "@nestjs/swagger";
import { Contains, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, Max, Min } from 'class-validator';
import { Settings } from "http2";
import { Match } from "../decorators/match.decorator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsPhoneNumber()
    phone: string;
    @ApiProperty()
    @IsString()
    adderres: string;
    @ApiProperty()
    @IsString()
    // @IsNotEmpty()
    // @Min(8)
    // @Max(20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
    @ApiProperty()
    @IsString()
    // @IsNotEmpty()
    // @Min(8)
    // @Max(20)
    @Match("password", {message: 'repeat password must be idenitcal to password'})
    password_confirmation: string;
    @ApiProperty()
    @IsString()
    @Contains(UserRole.MANAGER)
    @IsEnum(UserRole)
    role: string;
}
