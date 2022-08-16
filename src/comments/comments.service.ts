import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostComment } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(PostComment)
    readonly commentRepository: Repository<PostComment>,
    private readonly postService: PostsService,
  ) {}

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.postService.findOneById(postId);
    if (!post) throw new BadRequestException('post not found');

    if (createCommentDto.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: {
          id: createCommentDto.parentCommentId,
          postId,
        },
      });
      if (!parentComment) delete createCommentDto.parentCommentId;
    }
    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
      postId,
    });
    return await this.commentRepository.save(comment);
  }

  async findAll(postId: string) {
    return await this.commentRepository.find({
      where: { postId },
      relations: ['user'],
    });
  }

  async update(
    commentId: string,
    postId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, postId, userId },
    });
    if (!comment) throw new BadRequestException('comment not found');

    if (comment.id === updateCommentDto?.parentCommentId)
      delete updateCommentDto.parentCommentId;
    if (updateCommentDto.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: {
          id: updateCommentDto.parentCommentId,
          postId,
        },
      });
      if (!parentComment) delete updateCommentDto.parentCommentId;
    }
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async delete(commentId: string, postId: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        postId,
        userId,
      },
    });
    if (!comment) throw new BadRequestException('comment not found.');
    return await this.commentRepository.delete(commentId);
  }
}
