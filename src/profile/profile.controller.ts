import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.profileService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.profileService.update(id, updateProfileDto);
    }
}
