import {
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';

import { FriendRequestAction, FriendsService } from './friends.service';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Post('/requests/:requestId')
  sendFriendRequest(
    @GetUser('id') userId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.friendService.sendFriendRequest(userId, requestId);
  }

  @Get()
  getFriends(@GetUser('id') userId: string) {
    return this.friendService.getFriendsOf(userId);
  }

  @Get('/requests')
  getPendingRequests(@GetUser('id') userId: string) {
    return this.friendService.getPendingRequestOf(userId);
  }

  @Delete('/:friendId')
  deleteFriend(
    @GetUser('id') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.friendService.removeFriend(userId, friendId);
  }

  @Patch('/requests/:requestId')
  acceptOrDeclineFriendRequest(
    @GetUser('id') userId: string,
    @Param('requestId') requestId: string,
    @Query('action', new ParseEnumPipe(FriendRequestAction))
    action: FriendRequestAction,
  ) {
    return this.friendService.actionAcceptOrDeclineFriendRequest(
      userId,
      requestId,
      action,
    );
  }
}
