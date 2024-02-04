import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticModule } from './static.module';
import { UserModule } from './users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './posts/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '12h' },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    StaticModule,
    PostModule,
    UserModule,
  ],
})
export class AppModule {}
