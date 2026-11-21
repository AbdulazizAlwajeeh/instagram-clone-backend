import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from './entities/profile.entity';
import { Not, Repository } from 'typeorm';
import { Follows } from './entities/follow.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profiles)
        private readonly profileRepo: Repository<Profiles>,
        @InjectRepository(Follows)
        private readonly followRepo: Repository<Follows>,
    ) { }

    async isUsernameTaken(username: string): Promise<boolean> {
        return await this.profileRepo.exists({ where: { username } });
    }

    async create(id: string, username: string) {
        const profile = await this.profileRepo.create({ id, username });

        return await this.profileRepo.save(profile);
    }

    private async isFollowed(followerId: string, followingId: string): Promise<Follows | null> {
        const record = await this.followRepo.findOne({
            where: { followerId, followingId },
        });

        return record;
    }

    async findOne(userId: string, targetId: string) {

        const profile = await this.profileRepo.findOne({ where: { id: targetId } });
        if (!profile) { throw new NotFoundException() };

        const isFollowed = await this.isFollowed(userId, targetId);
        profile.isFollowed = !!isFollowed;

        return profile;
    }

    async toggleFollow(userId: string, targetId: string) {
        if (userId === targetId) { throw new BadRequestException('You cannot follow yourself') };

        const isFollowed = await this.isFollowed(userId, targetId);

        if (isFollowed) {
            return this.followRepo.delete({ followerId: userId, followingId: targetId });
        }

        const follow = this.followRepo.create({ followerId: userId, followingId: targetId });
        return this.followRepo.save(follow);
    }

    async update(id: string, updateProfileDto: UpdateProfileDto) {

        if (updateProfileDto.username) {
            const usernameExists = await this.profileRepo.exists({
                where: {
                    username: updateProfileDto.username,
                    id: Not(id),
                },
            });

            if (usernameExists) {
                throw new ConflictException('Username is already taken');
            }
        }

        const profile = await this.profileRepo.preload({ id, ...updateProfileDto });
        if (!profile) { throw new NotFoundException() };

        return await this.profileRepo.save(profile);
    }
}
