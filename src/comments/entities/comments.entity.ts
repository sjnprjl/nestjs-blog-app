import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/posts.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface IComment {
  userId: string;
  parentComment: IComment;
  comment: string;
}

@Entity('post_comments')
export class PostComment implements IComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  parentCommentId: string;

  @Column()
  postId: string;

  @ManyToOne(() => PostComment, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: IComment;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @Column()
  comment: string;
}
