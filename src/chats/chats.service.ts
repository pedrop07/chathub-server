import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UserService } from 'src/user/user.service';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { AddMemberDto } from './dtos/add-member.dto';
import { RemoveMemberDto } from './dtos/remove-member.dto';
import { AddMessageDto } from './dtos/add-message.dto';
import { DeleteChatDto } from './dtos/delete-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
  ) {}

  async findByIdOrFail(chatId: string) {
    try {
      const chat = await this.chatRepository.findOneOrFail({
        where: {
          id: chatId,
        },
        relations: {
          owner: true,
          members: true,
          messages: {
            user: true,
          },
        },
        select: {
          owner: {
            id: true,
            email: true,
            username: true,
          },
          members: {
            id: true,
            email: true,
            username: true,
          },
          messages: {
            id: true,
            text: true,
            created_at: true,
            user: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
        order: {
          messages: {
            created_at: 'ASC',
          },
        },
      });

      return chat;
    } catch (error) {
      throw new NotFoundException('Chat not found');
    }
  }

  async getAll() {
    const chats = await this.chatRepository.find({
      relations: {
        members: true,
        owner: true,
      },
      select: {
        owner: {
          id: true,
          email: true,
          username: true,
        },
        members: {
          email: true,
          username: true,
        },
      },
    });
    return chats;
  }

  async create(createChatDto: CreateChatDto, ownerId: string) {
    const owner = await this.userService.findByIdOrFail(ownerId);

    const ownerAlreadyHasAChat = await this.chatRepository.findOneBy({
      owner: {
        id: owner.id,
      },
    });

    if (ownerAlreadyHasAChat)
      throw new BadRequestException('User cannot have more than 1 Chat');

    const chat = this.chatRepository.create({
      title: createChatDto.title,
      description: createChatDto.description,
      members: [owner],
    });

    chat.owner = owner;

    await this.chatRepository.save(chat);
  }

  async update(chatId: string, ownerId: string, updateChatDto: UpdateChatDto) {
    const chat = await this.findByIdOrFail(chatId);
    const owner = await this.userService.findByIdOrFail(ownerId);

    if (chat.owner.id !== owner.id) {
      throw new BadRequestException('Only the owner can make changes');
    }

    chat.title = updateChatDto.title;
    chat.description = updateChatDto.description;

    await this.chatRepository.save(chat);
  }

  async delete(deleteChatDto: DeleteChatDto) {
    const chat = await this.findByIdOrFail(deleteChatDto.chatId);
    await this.chatRepository.delete({ id: chat.id });
  }

  async addMember(addMemberDto: AddMemberDto) {
    const member = await this.userService.findByIdOrFail(addMemberDto.memberId);
    const chat = await this.findByIdOrFail(addMemberDto.chatId);

    const memberIsTheOwner = member.id === chat.owner.id;

    if (memberIsTheOwner) {
      throw new BadRequestException('User is the owner of this chat');
    }

    const memberAlreadyInChat = member.chats.some(({ id }) => id === chat.id);

    if (memberAlreadyInChat) {
      throw new BadRequestException('User is already in this chat');
    }

    chat.members.push(member);

    await this.chatRepository.save(chat);
  }

  async removeMember(removeMemberDto: RemoveMemberDto) {
    const member = await this.userService.findByIdOrFail(
      removeMemberDto.memberId,
    );
    const chat = await this.findByIdOrFail(removeMemberDto.chatId);

    const memberIsTheOwner = member.id === chat.owner.id;

    if (memberIsTheOwner) {
      throw new BadRequestException('User is the owner of this chat');
    }

    const memberIsNotInChat = member.chats.every(({ id }) => id !== chat.id);

    if (memberIsNotInChat) {
      throw new BadRequestException('User is not in this chat');
    }

    const memberIndex = chat.members.findIndex(({ id }) => id === member.id);

    chat.members.splice(memberIndex, 1);

    await this.chatRepository.save(chat);
  }

  async addMessage(addMessageDto: AddMessageDto) {
    const message = this.messageRepository.create({
      chat: {
        id: addMessageDto.chatId,
      },
      user: {
        id: addMessageDto.memberId,
      },
      text: addMessageDto.text,
    });

    await this.messageRepository.save(message);

    const member = await this.userService.findByIdOrFail(
      addMessageDto.memberId,
    );

    message.user.username = member.username;

    return message;
  }
}
