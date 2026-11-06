import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profiles } from './entities/profile.entity';
import { Blocks } from './entities/block.entity';
import { Follows } from './entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles, Blocks, Follows,])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule { }
