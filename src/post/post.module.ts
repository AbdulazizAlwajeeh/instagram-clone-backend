import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { PostReports } from './entities/post-report.entity';
import { Likes } from './entities/like.entity';
import { Comments } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, PostReports, Likes, Comments])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule { }
