import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }
}
