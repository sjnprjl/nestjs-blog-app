import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { FriendsService } from 'src/users/friends/friends.service';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/posts.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  private readonly POST_DELETE_DAY = 5;
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly friendService: FriendsService,
  ) {}
  async findAll(userId: string | undefined) {
    return await this.postRepository.find({ where: { isVerified: true } });
  }

  async findOnlyVerified() {
    return await this.postRepository.find({ where: { isVerified: true } });
  }

  async findOneById(id: string) {
    return await this.findOneBy({ id });
  }

  async findOneBy(where: FindOptionsWhere<Post> | FindOptionsWhere<Post>[]) {
    return await this.postRepository.findOne({ where });
  }

  async getPostOfFriends(selfId: string) {
    // naive approach
    const friends = await this.friendService.getFriendsOf(selfId);
    if (friends.length === 0)
      throw new BadRequestException('no any post to show.');

    const friendIds = friends.map((friend) =>
      friend.selfId === selfId ? friend.friendId : friend.selfId,
    );

    const posts = await this.postRepository.find({
      where: {
        userId: In(friendIds),
        isVerified: true,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['user'],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        user: {
          fullName: true,
          username: true,
        },
      },
    });
    return posts;
  }

  private async createUniqueSlug(title: string) {
    const slug = slugify(title, { lower: true }); // create slug

    const isPostExist = await this.findOneBySlug(slug);

    if (isPostExist)
      throw new BadRequestException('post with similar title already exist'); // throw error if post
    // already exist

    return slug;
  }

  async create(userId: string, createPostDto: CreatePostDto) {
    const slug = await this.createUniqueSlug(createPostDto.title);
    return await this.postRepository.save({ ...createPostDto, slug, userId }); // create post and return response
  }

  async findOneBySlug(slug: string) {
    return await this.postRepository.findOne({ where: { slug } }); // check if post already exist
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOneBy({ id, userId });
    if (!post) throw new BadRequestException('post not found.');

    let slug = null;
    if (updatePostDto.title && post.title !== updatePostDto.title)
      slug = await this.createUniqueSlug(updatePostDto.title);

    Object.assign(post, updatePostDto);
    slug && (post.slug = slug);

    return await this.postRepository.save(post);
  }

  async delete(userId: string, id: string) {
    return await this.postRepository.delete({ id, userId });
  }

  private dateDiffInDays(a: Date, b: Date) {
    // Discard the time and time-zone information.
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async deleteUnVerifiedPost() {
    this.logger.log('checking for unverified posts.');
    const usersPosts = await this.postRepository.find({
      where: { isVerified: false },
    });
    if (!usersPosts.length) return;
    usersPosts.map((post) => {
      const diff = this.dateDiffInDays(new Date(), post.createdAt);
      if (diff >= this.POST_DELETE_DAY) {
        return this.postRepository.delete(post.id);
      }
    });
  }

  async verifyPost(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    post.isVerified = true;
    return await this.postRepository.save(post);
  }
}
