import { Exclude } from 'class-transformer';
import { PostComment } from 'src/comments/entities/comments.entity';
import { Post } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserFriend } from '../friends/entities/friends.entity';

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

  @Exclude()
  @Column({ enum: UserRole, default: UserRole.normal })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  comments: PostComment[];

  @OneToMany(() => UserFriend, (userFriend) => userFriend.self)
  friends: UserFriend[];

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
