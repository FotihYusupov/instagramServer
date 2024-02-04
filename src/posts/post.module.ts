import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Posts } from './schemas/posts.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { User, UserSchema } from 'src/users/schemas/user.schemas';
import { CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: 'Comments', schema: CommentSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer) {}
}
