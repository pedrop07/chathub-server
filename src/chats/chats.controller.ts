import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  HttpCode,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get()
  async getAll() {
    return this.chatsService.getAll();
  }

  @Get(':chatId')
  async find(@Param('chatId') chatId: string) {
    return this.chatsService.findByIdOrFail(chatId);
  }

  @Post()
  async create(
    @Body() createChatDto: CreateChatDto,
    @Request() req: RequestWithUser,
  ) {
    return this.chatsService.create(createChatDto, req.user.userId);
  }

  @Patch(':chatId')
  async update(
    @Param('chatId') chatId: string,
    @Request() req: RequestWithUser,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return this.chatsService.update(chatId, req.user.userId, updateChatDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.chatsService.delete({ chatId: id });
  }
}
