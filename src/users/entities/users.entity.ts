import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IUser {
  fullName: string;
  username: string;
  password: string;
  email: string;
}

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
}
