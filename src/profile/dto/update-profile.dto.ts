import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    username?: string;
}