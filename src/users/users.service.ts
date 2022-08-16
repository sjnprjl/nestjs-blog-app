import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import * as argon from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneBy(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    const user = await this.userRepository.findOne({ where });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneBy([
      { email: createUserDto.email },
      { username: createUserDto.username },
    ]);
    if (user)
      throw new BadRequestException(
        'user with similar username or email exist.',
      );

    const hashed = await argon.hash(createUserDto.password);
    createUserDto.password = hashed;
    const response = await this.userRepository.save(createUserDto);
    delete response.password;
    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneBy({ id });
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async verifyUser(usernameOrEmail: string, plainPassword: string) {
    const user = await this.findOneBy([
      { email: usernameOrEmail },
      { username: usernameOrEmail },
    ]);
    if (!user) throw new BadRequestException('user is not found.');
    const isVerified = await argon.verify(user.password, plainPassword);
    if (isVerified) return user;
    throw new BadRequestException('password does not match.');
  }
}
