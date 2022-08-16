import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async login({ usernameOrEmail, password }: LoginDto) {
    const user = await this.usersService.verifyUser(usernameOrEmail, password);
    const claims: any = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(claims, {
      expiresIn: '7d',
      secret: JWT.secretOrKey,
    });

    return {
      jwt: accessToken,
    };
  }
}
