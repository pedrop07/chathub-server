import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteChatDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;
}
