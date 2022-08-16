import { Exclude } from 'class-transformer';
import { PostComment } from 'src/comments/entities/comments.entity';
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

  @Exclude()
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  comments: PostComment[];

  @Exclude()
  @Column({ enum: UserRole, default: UserRole.normal })
  role: UserRole;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
