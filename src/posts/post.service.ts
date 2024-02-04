import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Posts } from './schemas/posts.schema';
import { User } from '../users/schemas/user.schemas';
import { CreatePostDto } from './dto/create-post.dto';
import * as fs from 'fs';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Posts')
    private postModel: mongoose.Model<Posts>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel('Comments')
    private commentModel: mongoose.Model<Comment>,
  ) {}

  async getAllPosts(userId): Promise<any> {
    const posts = await this.postModel.find().populate('user').lean();
    posts.forEach((e: any) => {
      e.like = e.likes.includes(userId);
    });
    return posts;
  }

  async getUserPosts(id: string, userId: string): Promise<Posts[]> {
    const findUser = await this.userModel.findById(id);
    if (findUser) {
      const posts = await this.postModel.find({ user: id }).populate('user');
      posts.forEach((e: any) => {
        e.like = e.likes.includes(userId);
      });
      return posts;
    } else {
      throw new NotFoundException('user nor found');
    }
  }

  async findPost(id: string): Promise<Posts> {
    const findPost = await this.postModel.findById(id).populate('user');
    if (findPost) {
      return findPost;
    } else {
      throw new NotFoundException('Post Not found.');
    }
  }

  async getComments(postId: string): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ post: postId })
      .populate('user');
    return comments;
  }

  async createPost(
    postDto: CreatePostDto,
    file: File & { buffer: Buffer; originalname: string },
    id: string,
  ): Promise<string> {
    const { originalname, buffer } = file;
    const imagePath = `./uploads/${originalname}`;
    fs.writeFileSync(imagePath, buffer);
    const data = {
      postDesc: postDto.postDesc,
      postUrl: `${process.env.URL}${originalname}`,
      comments: [],
      user: id,
    };
    await this.postModel.create(data);
    return 'New post added';
  }

  async addCommentToPost(
    postId: string,
    commentText: string,
    userId: string,
  ): Promise<string> {
    await this.commentModel.create({
      text: commentText,
      user: userId,
      post: postId,
    });
    return 'comment added';
  }

  async addLike(userId: string, postId: string): Promise<string> {
    const findPost = await this.postModel.findById(postId);
    findPost.likes.push(userId);
    await findPost.save();
    return 'Success';
  }

  async removeLike(userId: string, postId: string): Promise<string> {
    const findPost = await this.postModel.findById(postId);
    findPost.likes = findPost.likes.filter((e) => e !== userId);
    await findPost.save();
    return 'Success';
  }

  async deletePost(postId: string): Promise<string> {
    await this.postModel.findByIdAndDelete(postId);
    return 'Post deleted';
  }
}
