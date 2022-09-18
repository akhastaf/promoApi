import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Match } from "src/user/decorators/match.decorator";
import { UserRole } from "src/user/entities/user.entity";

export class RegisterCustomerDto {
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
    @IsOptional()
    @IsOptional()
    adderres?: string;
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
    @IsEnum(UserRole)
    @IsOptional()
    role?: string;
}
