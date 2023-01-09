import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";

export class LoginUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    username: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
}