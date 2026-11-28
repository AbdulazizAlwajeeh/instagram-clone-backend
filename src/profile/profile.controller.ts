import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get(':id')
    @ApiOperation({summary: 'Fetches a profile by ID'})
    findOne(
        @Param('id', ParseUUIDPipe) targetId: string,
        @GetUser() user: any) {
        return this.profileService.findOne(user.sub, targetId);
    }

    @Post(':id/follow')
    @ApiOperation({summary: 'Follows/unfollows a profile'})
    toggleFollow(
        @Param('id', ParseUUIDPipe) targetId: string,
        @GetUser() user: any) {
        return this.profileService.toggleFollow(user.sub, targetId);
    }

    @Patch()
    @ApiOperation({summary: 'Updates a profile'})
    update(
        @GetUser() user: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.profileService.update(user.sub, updateProfileDto);
    }
}
