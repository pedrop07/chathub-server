import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { JoinChatDto } from './dtos/join-chat.dto';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { AddMemberDto } from './dtos/add-member.dto';
import { UserService } from 'src/user/user.service';
import { RemoveMemberDto } from './dtos/remove-member.dto';
import { AddMessageDto } from './dtos/add-message.dto';
import { DeleteChatDto } from './dtos/delete-chat.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
@UsePipes(new ValidationPipe())
@UseFilters(AllExceptionsFilter)
@UseGuards(WsAuthGuard)
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  constructor(
    private chatsService: ChatsService,
    private userService: UserService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatsService.findByIdOrFail(data.chatId);
    client.join(chat.id);
  }

  @SubscribeMessage('deleteChat')
  async handleDeleteChat(@MessageBody() data: DeleteChatDto) {
    await this.chatsService.delete(data);
    this.server.to(data.chatId).emit('deleteChat', data.chatId);
  }

  @SubscribeMessage('addMember')
  async handleAddMember(@MessageBody() data: AddMemberDto) {
    await this.chatsService.addMember(data);
    const newMember = await this.userService.findByIdOrFail(data.memberId);
    this.server.to(data.chatId).emit('addMember', newMember);
  }

  @SubscribeMessage('removeMember')
  async handleRemoveMember(@MessageBody() data: RemoveMemberDto) {
    await this.chatsService.removeMember(data);
    const memberToRemove = await this.userService.findByIdOrFail(data.memberId);
    this.server.to(data.chatId).emit('removeMember', memberToRemove);
  }

  @SubscribeMessage('addMessage')
  async handleAddMessage(@MessageBody() data: AddMessageDto) {
    const message = await this.chatsService.addMessage(data);
    this.server.to(data.chatId).emit('addMessage', message);
  }
}
