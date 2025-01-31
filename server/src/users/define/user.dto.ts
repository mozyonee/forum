import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { PartialType } from "@nestjs/mapped-types"

class PasswordDto {
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    salt?: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    password?: string;
}

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    _id: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    username: string;

    @IsEmail()
    @Type(() => String)
    email: string;

    @ValidateNested()
    @Type(() => PasswordDto)
    authentication?: PasswordDto;

    following: [string];
}

export class UpdateUserDto extends PartialType(UserDto) { }