import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profiles } from './entities/profile.entity';
import { Blocks } from './entities/block.entity';
import { Follows } from './entities/follow.entity';
import { Chats } from '../entities/Chats';
import { Comments } from "../entities/Comments";
import { Likes } from "../entities/Likes";
import { Messages } from "../entities/Messages";
import { PostReports } from "../entities/PostReports";
import { Posts } from "../entities/Posts";

@Module({
  // This is temporary to evade build errors until a new module is made for entities from Chats to Posts
  imports: [TypeOrmModule.forFeature([Profiles, Blocks, Follows, Chats, Comments, Likes, Messages, PostReports, Posts])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
