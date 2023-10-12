import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveMemberDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsUUID()
  memberId: string;
}
