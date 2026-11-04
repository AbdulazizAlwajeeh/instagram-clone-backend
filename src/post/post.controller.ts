import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    create(@Body() createPostDto: CreatePostDto) { // This is temporary until we implement guards
        const profileId = '876c469d-cdf5-4b47-be77-95271fc835c6';
        return this.postService.create(profileId, createPostDto);
    }

    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.findOne(id);
    }
}
