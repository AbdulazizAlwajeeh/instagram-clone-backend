import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { Messages } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chats)
        private readonly chatRepo: Repository<Chats>,
        @InjectRepository(Messages)
        private readonly messageRepo: Repository<Messages>,
    ) { }

    // Helper 1: Handles find-or-create when opening a conversation thread via a user profile
    private async getOrCreateChatId(userId: string, targetUserId?: string): Promise<string> {
        if (!targetUserId) {
            throw new BadRequestException('Either chatId or targetUserId must be provided');
        }

        const userOne = userId < targetUserId ? userId : targetUserId;
        const userTwo = userId > targetUserId ? userId : targetUserId;

        let chat = await this.chatRepo.findOne({
            where: { profileOne: { id: userOne }, profileTwo: { id: userTwo } }
        });

        if (!chat) {
            chat = this.chatRepo.create({
                profileOne: { id: userOne },
                profileTwo: { id: userTwo }
            });
            chat = await this.chatRepo.save(chat);
        }

        return chat.id;
    }

    // Helper 2: Handles security check when a client requests data directly using a chatId
    private async validateChatAccess(chatId: string, userId: string): Promise<Chats> {
        const chat = await this.chatRepo.findOne({
            where: [
                { id: chatId, profileOne: { id: userId } },
                { id: chatId, profileTwo: { id: userId } }
            ],
            relations: {
                profileOne: true,
                profileTwo: true
            },
            select: {
                id: true,
                profileOne: { id: true },
                profileTwo: { id: true }
            }
        });

        if (!chat) {
            throw new NotFoundException('Chat not found or you are not a participant');
        }

        return chat;
    }

    async findAllChats(userId: string): Promise<Chats[]> {
        return this.chatRepo.find({
            where: [
                { userOne: userId },
                { userTwo: userId }
            ],
            relations: {
                profileOne: true,
                profileTwo: true
            },
            order: {
                lastMessageTime: 'DESC',
            },
        });
    }

    async findAllMessages(userId: string, chatId?: string, targetUserId?: string): Promise<Messages[]> {
        // 1. Resolve or validate the active chat ID using standalone logic
        const activeChatId = chatId
            ? (await this.validateChatAccess(chatId, userId)).id
            : await this.getOrCreateChatId(userId, targetUserId);

        // 2. Fetch and return the messages for the resolved chat ID
        return await this.messageRepo.find({
            where: { conversation: { id: activeChatId } },
            relations: { sender: true },
            order: { createdAt: 'ASC' },
        });
    }

    async sendMessage(chatId: string, content: string, senderId: string): Promise<Messages> {
        // 1. Verifies room existence, membership, and loads the participants
        const chat = await this.validateChatAccess(chatId, senderId);

        // 2. Determine who the receiver is based on who is sending the message
        const receiverId = chat.profileOne.id === senderId ? chat.profileTwo.id : chat.profileOne.id;

        // 3. Create and save the new message
        const newMessage = this.messageRepo.create({
            content,
            conversation: { id: chatId },
            sender: { id: senderId },
            receiver: { id: receiverId },
        });

        return this.messageRepo.save(newMessage);
    }
}
