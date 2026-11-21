import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe) targetId: string,
        @GetUser() user: any) {
        return this.profileService.findOne(user.sub, targetId);
    }

    @Post(':id/follow')
    toggleFollow(
        @Param('id', ParseUUIDPipe) targetId: string,
        @GetUser() user: any) {
        return this.profileService.toggleFollow(user.sub, targetId);
    }

    @Patch()
    update(
        @GetUser() user: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.profileService.update(user.sub, updateProfileDto);
    }
}
