import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, Max, Min } from "class-validator";
import { Match } from "src/user/decorators/match.decorator";

export class ResetDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    @Match("password", {message: 'repeat password must be idenitcal to password'})
    password_confirmation: string;
}