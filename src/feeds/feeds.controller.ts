import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { FeedsService } from './feeds.service';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  getFeeds(@GetUser('id') userId: string) {
    return this.feedsService.getFeeds(userId);
  }
}
