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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/users/entities/users.entity';
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
  getAll(@GetUser('id') userId: string) {
    return this.postsService.findAll(userId);
  }

  @Get('/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @Roles(UserRole.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id/verify')
  postVerify(@Param('id') id: string) {
    return this.postsService.verifyPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, userId, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@GetUser('id') userId: string, @Param('id') id: string) {
    const deleted = await this.postsService.delete(userId, id);
    delete deleted.raw;
    return deleted;
  }
}
