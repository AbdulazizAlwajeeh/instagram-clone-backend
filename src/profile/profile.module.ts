import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profiles } from './entities/profile.entity';
import { Blocks } from './entities/block.entity';
import { Follows } from './entities/follow.entity';
import { Chats } from '../entities/Chats';
import { Messages } from "../entities/Messages";

@Module({
  // This is temporary to evade build errors until a new module is made for entities Chats and Messages
  imports: [TypeOrmModule.forFeature([Profiles, Blocks, Follows, Chats, Messages])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
