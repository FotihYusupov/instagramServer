import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Posts {
  @Prop()
  postDesc: string;

  @Prop()
  postUrl: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: [] })
  likes: Array<string>;

  @Prop()
  like?: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: string;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
