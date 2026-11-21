import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    create(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: any,
    ) {
        return this.postService.create(user.sub, createPostDto);
    }

    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any) {
        return this.postService.findOne(postId, user.sub);
    }

    @Post(':id/like')
    @HttpCode(HttpStatus.OK)
    toggleLike(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any,
    ) {
        return this.postService.toggleLike(user.sub, postId);
    }

    @Post(':id/comments')
    addComment(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.postService.addComment(user.sub, postId, createCommentDto);
    }

    @Get(':id/comments')
    getComments(@Param('id', ParseUUIDPipe) postId: string) {
        return this.postService.getComments(postId);
    }

    @Post(':id/report')
    @HttpCode(HttpStatus.OK)
    reportPost(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any,
    ) {
        return this.postService.reportPost(user.sub, postId);
    }
}
