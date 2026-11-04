import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Posts)
        private readonly postRepo: Repository<Posts>,
    ) { }

    async create(userId: string, createPostDto: CreatePostDto): Promise<Posts> {
        const newPost = this.postRepo.create({
            caption: createPostDto.caption,
            mediaUrl: createPostDto.mediaUrl,
            user: { id: userId },
        });

        return await this.postRepo.save(newPost);
    }

    async findOne(id: string): Promise<Posts> {
        const post = await this.postRepo.findOne({
            where: { id },
            relations: { user: true, comments: true},
        });

        if (!post) {
            throw new NotFoundException(`Post with ID "${id}" not found`);
        }

        return post;
    }


    async findAll(): Promise<Posts[]> {
        return await this.postRepo.find({
            relations: {user: true},
            order: {
                createdAt: 'DESC',
            },
        });
    }
}
