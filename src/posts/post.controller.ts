import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guadr';
import { PostService } from './post.service';
import { Posts } from './schemas/posts.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getPosts(
    @Request() req: Request & { user: { id: string } },
  ): Promise<any> {
    return this.postService.getAllPosts(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getUserPosts(
    @Param('userId')
    userId: string,
    @Request() req: Request & { user: { id: string } },
  ): Promise<Posts[]> {
    return this.postService.getUserPosts(userId, req.user.id);
  }

  @Get('comments/:postId')
  async getPostComments(
    @Param('postId')
    postId: string,
  ): Promise<any> {
    const comments = this.postService.getComments(postId);
    return comments;
  }

  @Get('post/:postId')
  async getPost(
    @Param('postId')
    postId: string,
  ): Promise<Posts> {
    return this.postService.findPost(postId);
  }

  @UseGuards(AuthGuard)
  @Put('/like/:postId')
  async addLike(
    @Param('postId')
    postId: string,
    @Request() req: Request & { user: { id: string } },
  ): Promise<string> {
    return this.postService.addLike(req.user.id, postId);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Body() postDto: CreatePostDto,
    @UploadedFile() file: any,
    @Request() req: Request & { user: { id: string } },
  ): Promise<string> {
    return this.postService.createPost(postDto, file, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('/add-comment/:postId')
  async addComment(
    @Param('postId')
    postId: string,
    @Body()
    body: { text: string },
    @Request() req: Request & { user: { id: string } },
  ): Promise<string> {
    return this.postService.addCommentToPost(postId, body.text, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put('/remove-like/:postId')
  async deleteLike(
    @Param('postId')
    postId: string,
    @Request() req: Request & { user: { id: string } },
  ): Promise<string> {
    return this.postService.removeLike(req.user.id, postId);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:postId')
  async deletePost(
    @Param('postId')
    postId: string,
  ): Promise<string> {
    return this.postService.deletePost(postId);
  }
}
