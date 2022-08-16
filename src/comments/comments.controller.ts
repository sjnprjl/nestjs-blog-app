import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post()
  create(
    @GetUser('id') userId: string,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(userId, postId, createCommentDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getPostComments(@Param('postId') postId: string) {
    return this.commentService.findAll(postId);
  }

  @Patch(':commentId')
  editPostComment(
    @Param('postId') postId: string,
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(
      commentId,
      postId,
      userId,
      updateCommentDto,
    );
  }
  @Delete('/:commentId')
  deletePostComment(
    @Param('postId') postId: string,
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.delete(commentId, postId, userId);
  }
}
