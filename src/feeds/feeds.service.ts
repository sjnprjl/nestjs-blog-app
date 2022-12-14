import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class FeedsService {
  constructor(private readonly postService: PostsService) {}

  async getFeeds(userId: string) {
    return await this.postService.getPostOfFriends(userId);
  }
}
