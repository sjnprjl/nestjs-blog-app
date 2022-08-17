import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { FeedsService } from './feeds.service';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}
  @Get()
  getFeeds(@GetUser('id') userId: string) {
    return this.feedsService.getFeeds(userId);
  }
}
