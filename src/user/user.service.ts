import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOneByOrFail({
        email,
      });
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async register(registerUserDto: RegisterUserDto): Promise<Partial<User>> {
    const createdUser = this.userRepository.create({
      ...registerUserDto,
      password_hash: await hash(registerUserDto.password, 10),
    });

    const user = await this.userRepository.save(createdUser);

    const { id, name, email, created_at } = user;

    return {
      id,
      name,
      email,
      created_at,
    };
  }
}
