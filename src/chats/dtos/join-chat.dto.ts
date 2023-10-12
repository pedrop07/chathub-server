import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinChatDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;
}
