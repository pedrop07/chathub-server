import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  owner: User;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  members: User[];

  @OneToMany(() => Message, (message) => message.chat, {
    cascade: true,
  })
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;
}
