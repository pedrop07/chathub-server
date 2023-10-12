import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(50)
  @MaxLength(255)
  description: string;
}
