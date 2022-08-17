import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FriendsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
