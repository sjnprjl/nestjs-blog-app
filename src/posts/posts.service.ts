import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/posts.entity';

import slugify from 'slugify';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: string) {
    return await this.postRepository.findOne({ where: { id } });
  }

  private async createUniqueSlug(title: string) {
    const slug = slugify(title, { lower: true }); // create slug

    const isPostExist = await this.findOneBySlug(slug);

    if (isPostExist)
      throw new BadRequestException('post with similar title already exist'); // throw error if post already exist

    return slug;
  }

  async create(userId: string, createPostDto: CreatePostDto) {
    const slug = await this.createUniqueSlug(createPostDto.title);
    return await this.postRepository.save({ ...createPostDto, slug, userId }); // create post and return response
  }

  async findOneBySlug(slug: string) {
    return await this.postRepository.findOne({ where: { slug } }); // check if post already exist
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    if (!post) throw new BadRequestException('post not found.');

    let slug = null;
    if (updatePostDto.title && post.title !== updatePostDto.title)
      slug = await this.createUniqueSlug(updatePostDto.title);

    Object.assign(post, updatePostDto);
    slug && (post.slug = slug);

    return await this.postRepository.save(post);
  }

  async delete(id: string) {
    return await this.postRepository.delete(id);
  }
}
