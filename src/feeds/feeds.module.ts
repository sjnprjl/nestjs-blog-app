import { Module } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  imports: [PostsModule],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
