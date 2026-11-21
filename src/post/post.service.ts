import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Posts } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './entities/comment.entity';
import { PostReports } from './entities/post-report.entity';
import { Likes } from './entities/like.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Posts)
        private readonly postRepo: Repository<Posts>,
        @InjectRepository(Comments)
        private readonly commentRepo: Repository<Comments>,
        @InjectRepository(PostReports)
        private readonly reportRepo: Repository<PostReports>,
        @InjectRepository(Likes)
        private readonly likeRepo: Repository<Likes>,
    ) { }

    async create(userId: string, createPostDto: CreatePostDto): Promise<Posts> {
        const newPost = this.postRepo.create({
            caption: createPostDto.caption,
            mediaUrl: createPostDto.mediaUrl,
            user: { id: userId },
        });

        return await this.postRepo.save(newPost);
    }

    async findOne(postId: string, userId: string): Promise<Posts> {
        const post = await this.postRepo.findOne({
            where: { id: postId },
            relations: { user: true },
            select: { user: { id: true, username: true, avatarUrl: true } }
        });

        if (!post) {
            throw new NotFoundException(`Post with ID "${postId}" not found`);
        }

        post.isLiked = await this.isPostLiked(postId, userId);

        post.reportedByMe = await this.isPostReported(postId, userId);

        return post;
    }

    async findAll(): Promise<Posts[]> {
        return await this.postRepo.find({
            relations: { user: true },
            select: { user: { id: true, username: true, avatarUrl: true } },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findByProfileId(profileId: string): Promise<Posts[]> {
        const posts = await this.postRepo.find({
            relations: { user: true },
            where: {
                user: {
                    id: profileId,
                },
            },
            select: { user: { id: true, username: true, avatarUrl: true } },
            order: {
                createdAt: 'DESC',
            },
        })

        return posts;
    }

    async getHomeFeed(userId: string): Promise<Posts[]> {

        // Getting only the posts of the followed profiles
        const posts = await this.postRepo.find({
            relations: { user: true },
            where: {
                user: {
                    follows2: {
                        followerId: userId,
                    },
                },
            },
            select: { user: { id: true, username: true, avatarUrl: true } },
            order: {
                createdAt: 'DESC',
            },
        })

        if (posts.length === 0) return [];

        // Deciding whether the post is liked by the user
        const postIds = posts.map((post) => post.id);
        const userLikes = await this.likeRepo.find({
            select: { postId: true },
            where: {
                userId,
                postId: In(postIds),
            },
        });
        const likedPostIds = new Set(userLikes.map((like) => like.postId));

        posts.forEach((post) => {
            post.isLiked = likedPostIds.has(post.id);
        })

        return posts;
    }

    private async ensurePostExists(postId: string): Promise<void> {
        const postExists = await this.postRepo.exists({
            where: { id: postId },
        });

        if (!postExists) {
            throw new NotFoundException(`Post with ID "${postId}" not found`);
        }
    }

    private async isPostLiked(postId: string, userId: string): Promise<boolean> {
        return this.likeRepo.exists({
            where: { postId, userId },
        });
    }

    private async isPostReported(postId: string, reporterId: string): Promise<boolean> {
        return this.reportRepo.exists({
            where: { postId, reporterId },
        });
    }

    async toggleLike(userId: string, postId: string) {
        await this.ensurePostExists(postId);

        const existingLike = await this.likeRepo.findOne({
            where: { postId, userId },
            select: { id: true },
        });

        if (existingLike) {
            return this.likeRepo.delete(existingLike.id);
        }

        const like = this.likeRepo.create({ postId, userId });
        return this.likeRepo.save(like);
    }

    async addComment(userId: string, postId: string, createCommentDto: CreateCommentDto): Promise<Comments> {
        await this.ensurePostExists(postId);

        const comment = this.commentRepo.create({
            message: createCommentDto.message,
            post: { id: postId },
            user: { id: userId },
        });

        return this.commentRepo.save(comment);
    }

    async getComments(postId: string): Promise<Comments[]> {
        await this.ensurePostExists(postId);

        return this.commentRepo.find({
            where: { post: { id: postId } },
            relations: { user: true },
            select: { user: { id: true, username: true, avatarUrl: true } },
            order: { createdAt: 'ASC' },
        });
    }

    async reportPost(userId: string, postId: string) {
        await this.ensurePostExists(postId);

        const alreadyReported = await this.reportRepo.exists({
            where: { postId, reporterId: userId }
        })

        if (alreadyReported) {
            throw new ConflictException('You have already reported this post');
        }

        const report = this.reportRepo.create({
            postId,
            reporterId: userId,
        });

        return this.reportRepo.save(report);
    }
}
