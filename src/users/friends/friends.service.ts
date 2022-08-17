import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserFriend } from './entities/friends.entity';

export enum FriendRequestAction {
  accept = 'accept',
  decline = 'decline',
}

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(UserFriend)
    private readonly userFriendRepository: Repository<UserFriend>,
  ) {}

  async getFriendsOf(userId: string) {
    return await this.userFriendRepository.find({
      where: [
        {
          selfId: userId,
          isFriend: true,
        },
        {
          friendId: userId,
          isFriend: true,
        },
      ],
    });
  }

  async sendFriendRequest(selfId: string, friendId: string) {
    if (selfId == friendId)
      throw new BadRequestException('you cannot send request to yourself.');
    const connection = await this.userFriendRepository.findOne({
      where: [
        {
          selfId,
          friendId,
        },
        { selfId: friendId, friendId: selfId },
      ],
    });
    if (connection)
      throw new BadRequestException('cannot send friend request.');
    return await this.userFriendRepository.save({
      selfId,
      friendId,
    });
  }

  async getPendingRequestOf(selfId: string) {
    return await this.userFriendRepository.find({
      where: {
        friendId: selfId,
        isFriend: false,
      },
    });
  }

  async removeFriend(selfId: string, friendId: string) {
    const connection = await this.userFriendRepository.findOne({
      where: [
        { selfId, friendId },
        { selfId: friendId, friendId: selfId },
      ],
    });
    if (!connection) throw new BadRequestException('no friendship connection.');
    return await this.userFriendRepository.delete(connection.id);
  }

  async actionAcceptOrDeclineFriendRequest(
    selfId: string,
    requestId: string,
    action: FriendRequestAction,
  ) {
    const request = await this.userFriendRepository.findOne({
      where: {
        id: requestId,
        friendId: selfId,
        isFriend: false,
      },
    });
    if (!request) throw new BadRequestException('no friend request sent.');
    // both parties can decline request
    if (action === FriendRequestAction.decline) {
      return await this.userFriendRepository.delete(request.id);
    }
    console.log(request, selfId, requestId);
    // but user who sent request cannot accept the request.
    if (request.selfId === selfId)
      throw new BadRequestException('cannot accept the request you sent.');
    request.isFriend = true;
    return await this.userFriendRepository.update(request.id, request);
  }
}
