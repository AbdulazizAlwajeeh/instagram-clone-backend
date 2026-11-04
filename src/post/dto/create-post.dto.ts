import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsOptional()
    caption?: string;

    @IsString()
    @IsNotEmpty()
    mediaUrl: string;
}