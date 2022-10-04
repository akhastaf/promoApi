import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgetDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}