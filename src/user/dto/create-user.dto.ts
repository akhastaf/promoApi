import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { Match } from "../decorators/match.decorator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    middel_name?: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // @Min(8)
    // @Max(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
    @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // @Min(8)
    // @Max(20)
    @Match("password", {message: 'repeat password must be idenitcal to password'})
    password_confirmation: string;
}
