import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  username: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop({ default: '' })
  userBio: string;

  @Prop({ default: '' })
  userImg: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
