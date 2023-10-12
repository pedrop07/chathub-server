import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsUUID()
  memberId: string;
}
