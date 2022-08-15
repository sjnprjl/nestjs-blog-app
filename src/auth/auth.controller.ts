import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludeExtraneousValues: false,
})
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() { usernameOrEmail, password }: LoginDto) {
    return this.userService.verifyUser(usernameOrEmail, password);
  }
}
