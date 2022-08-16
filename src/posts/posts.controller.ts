import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser('id') userId: string, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(userId, createPostDto);
  }

  @Get()
  getAll() {
    return this.postsService.findAll();
  }

  @Get('/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@GetUser('id') userId: string, @Param('id') id: string) {
    const deleted = await this.postsService.delete(userId, id);
    delete deleted.raw;
    return deleted;
  }
}
