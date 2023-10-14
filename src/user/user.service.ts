import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByIdOrFail(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: userId,
        },
        relations: {
          chats: {
            owner: true,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          chats: {
            id: true,
            title: true,
            description: true,
            created_at: true,
            owner: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async findByUsernameOrFail(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          username,
        },
        relations: {
          chats: {
            owner: true,
            members: true,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          chats: {
            id: true,
            title: true,
            description: true,
            created_at: true,
            owner: {
              id: true,
              username: true,
              email: true,
            },
            members: {
              username: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<Partial<User>> {
    const userWithSameEmail = await this.userRepository.findOneBy({
      email: registerUserDto.email,
    });
    const userWithSameUsername = await this.userRepository.findOneBy({
      username: registerUserDto.username,
    });

    if (userWithSameEmail) {
      throw new BadRequestException('A user with this email already exists.');
    }

    if (userWithSameUsername) {
      throw new BadRequestException(
        'A user with this username already exists.',
      );
    }

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password_hash: await hash(registerUserDto.password, 10),
    });

    await this.userRepository.save(newUser);

    const { id, username, email, created_at } = newUser;

    return {
      id,
      username,
      email,
      created_at,
    };
  }
}
