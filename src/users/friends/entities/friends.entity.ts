import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserFriend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  selfId: string;

  @Column()
  friendId: string;

  @Column({ default: false })
  isFriend: boolean;

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: 'selfId' })
  self: User;

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: 'friendId' })
  friend: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
