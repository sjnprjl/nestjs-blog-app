import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
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

  async verifyPost(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    post.isVerified = true;
    return await this.postRepository.save(post);
  }
}
