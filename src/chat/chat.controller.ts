import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('messages')
    @ApiOperation({ summary: 'Fetches the messages of a specific chat (if chat doesn\'t exist, it creates a new one)' })
    getMessages(
        @GetUser() user: any,
        @Query('chatId') chatId?: string,
        @Query('targetUserId') targetUserId?: string) {
        return this.chatService.findAllMessages(user.sub, chatId, targetUserId);
    }

    @Get()
    @ApiOperation({ summary: 'Fetches the chats that the user is part of' })
    getChats(@GetUser() user: any) {
        return this.chatService.findAllChats(user.sub);
    }

    @Post(':id')
    @ApiOperation({ summary: 'Sends a message to a specific chat' })
    createMessage(
        @Param('id') chatId: string,
        @Body() createMessageDto: CreateMessageDto,
        @GetUser() user: any) {
        return this.chatService.sendMessage(chatId, createMessageDto.content, user.sub);
    }
}
