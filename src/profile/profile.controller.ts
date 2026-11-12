import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.profileService.findOne(id);
    }

    @Patch()
    update(
        @GetUser() user: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.profileService.update(user.sub, updateProfileDto);
    }
}
