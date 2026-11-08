import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('messages')
    getMessages(
        @GetUser() user: any,
        @Query('chatId') chatId?: string,
        @Query('targetUserId') targetUserId?: string) {
        return this.chatService.findAllMessages(user.sub, chatId, targetUserId);
    }

    @Get()
    getChats(@GetUser() user: any) {
        return this.chatService.findAllChats(user.sub);
    }

    @Post(':id')
    createMessage(
        @Param('id') chatId: string,
        @Body() createMessageDto: CreateMessageDto,
        @GetUser() user: any) {
        return this.chatService.sendMessage(chatId, createMessageDto.content, user.sub);
    }
}
