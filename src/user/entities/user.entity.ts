import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;
}
