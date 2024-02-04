import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Comment {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
