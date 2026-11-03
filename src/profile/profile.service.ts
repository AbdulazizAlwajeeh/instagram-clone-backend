import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profiles)
        private readonly profileRepo: Repository<Profiles>,
    ) { }

    async isUsernameTaken(username: string): Promise<boolean> {
        return await this.profileRepo.exists({ where: { username } });
    }

    async create(id: string, username: string) {
        const profile = await this.profileRepo.create({ id, username });

        return await this.profileRepo.save(profile);
    }

    async findOne(id: string) {

        const profile = await this.profileRepo.findOne({ where: { id } });
        if (!profile) { throw new NotFoundException() };

        return profile;
    }

    async update(id: string, updateProfileDto: UpdateProfileDto) {

        const profile = await this.profileRepo.preload({ id, ...updateProfileDto });
        if (!profile) { throw new NotFoundException() };

        return await this.profileRepo.save(profile);
    }
}
