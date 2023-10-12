import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddMessageDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
