import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }
    
    // This is temporary until we implement guards, then user/sender ID will be extracted from the JWT

    @Get('messages')
    getMessages(
        @Headers('x-user-id') userId: string,
        @Query('chatId') chatId?: string,
        @Query('targetUserId') targetUserId?: string) {
        return this.chatService.findAllMessages(userId, chatId, targetUserId);
    }

    @Get(':userId')
    getChats(@Param('userId') userId: string) {
        return this.chatService.findAllChats(userId);
    }

    @Post(':id')
    createMessage(
        @Param('id') chatId: string,
        @Body() createMessageDto: CreateMessageDto,
        @Headers('x-sender-id') senderId: string) {
        return this.chatService.sendMessage(chatId, createMessageDto.content, senderId);
    }
}
