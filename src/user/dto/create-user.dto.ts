import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Contains, IsBoolean, IsBooleanString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, Max, Min } from 'class-validator';
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
    // @IsString()
    @IsOptional()
    address?: string;
    @ApiProperty()
    // @IsString()
    // // @IsNotEmpty()
    // // @Min(8)
    // // @Max(20)
    // // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password?: string;
    // @ApiProperty()
    // @IsString()
    // // @IsNotEmpty()
    // // @Min(8)
    // // @Max(20)
    // @Match("password", {message: 'repeat password must be idenitcal to password'})
    // password_confirmation: string;
    @ApiProperty()
    @IsString()
    // @Contains('STORE' || 'SALESMAN')
    @IsEnum(UserRole)
    role: string;
    @ApiProperty()
    avatar: any;
    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === "true")
    isActive?: boolean;
}
