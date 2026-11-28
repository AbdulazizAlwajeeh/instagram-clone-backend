import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    create(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: any,
    ) {
        return this.postService.create(user.sub, createPostDto);
    }

    @Get()
    @ApiOperation({ summary: 'Fetch all posts (profile ID is a query parameter, if not provided then it is explore mode)' })
    findAll(
        @Query('profileId', new ParseUUIDPipe({ optional: true })) profileId?: string,
    ) {
        if (profileId) {
            return this.postService.findByProfileId(profileId);
        }
        return this.postService.findAll();
    }

    @Get('feed')
    @ApiOperation({ summary: 'Fetches posts of profiles that the user follows' })
    getHomeFeed(
        @GetUser() user: any,
    ) {
        return this.postService.getHomeFeed(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Fetches a single post by ID' })
    findOne(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any) {
        return this.postService.findOne(postId, user.sub);
    }

    @Post(':id/like')
    @ApiOperation({ summary: 'Likes/unlikes a post' })
    @HttpCode(HttpStatus.OK)
    toggleLike(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any,
    ) {
        return this.postService.toggleLike(user.sub, postId);
    }

    @Post(':id/comments')
    @ApiOperation({ summary: 'Comments on a post' })
    addComment(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.postService.addComment(user.sub, postId, createCommentDto);
    }

    @Get(':id/comments')
    @ApiOperation({ summary: 'Fetches comments of a post' })
    getComments(@Param('id', ParseUUIDPipe) postId: string) {
        return this.postService.getComments(postId);
    }

    @Post(':id/report')
    @ApiOperation({ summary: 'Reports a post' })
    @HttpCode(HttpStatus.OK)
    reportPost(
        @Param('id', ParseUUIDPipe) postId: string,
        @GetUser() user: any,
    ) {
        return this.postService.reportPost(user.sub, postId);
    }
}
