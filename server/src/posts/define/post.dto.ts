import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { PartialType } from "@nestjs/mapped-types"

export class PostDto {
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    _id: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
	parent: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
	date: Date;
    
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    author: string;
    
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    text: string;

    likes: [string];
    reposts: [string];
    attachments: [string];
}

export class UpdatePostDto extends PartialType(PostDto) { }