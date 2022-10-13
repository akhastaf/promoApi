import { ApiProperty } from "@nestjs/swagger";
import { isAlpha, IsPhoneNumber, IsString } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty()
    @IsString()
    full_name: string;
    @ApiProperty()
    @IsPhoneNumber()
    phone: string;
    
}
