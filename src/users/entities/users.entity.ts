import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IUser {
  fullName: string;
  username: string;
  password: string;
  email: string;
}

export enum UserRole {
  normal = 'normal',
  admin = 'admin',
}

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ enum: UserRole, default: UserRole.normal })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
