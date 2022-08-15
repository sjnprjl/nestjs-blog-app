import { IsEmail, IsString } from 'class-validator';
import { IUser } from '../entities/users.entity';

export class CreateUserDto implements IUser {
  @IsString()
  fullName: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
