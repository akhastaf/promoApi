import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, Max, Min } from 'class-validator';
import { Match } from "src/user/decorators/match.decorator";

export class CreateCustomerDto {
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
    @IsPhoneNumber()
    phone: string;
    @ApiProperty()
    @IsString()
    address: string;
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
}
