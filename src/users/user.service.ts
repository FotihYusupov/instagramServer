import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async getUser(userId: string): Promise<User> {
    const users = await this.userModel.findById(userId);
    return users;
  }

  async searchUser(title: string): Promise<User[]> {
    const regex = new RegExp(title, 'i');
    const users = await this.userModel.find({ username: { $regex: regex } });
    if (!users) {
      throw new NotFoundException('Book not found');
    }
    return users;
  }

  async getMe(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Book not found');
    }
    return user;
  }

  async signUp(userDto: CreateUserDto): Promise<string> {
    const newUser = await this.userModel.create(userDto);
    return this.jwtService.signAsync({ id: newUser._id });
  }

  async logIn(user: { username: string; password: string }): Promise<string> {
    const findUser = await this.userModel.findOne({
      username: user.username,
      password: user.password,
    });
    if (!findUser) {
      throw new Error('User not found');
    }
    return this.jwtService.signAsync({ id: findUser._id });
  }

  async updateUser(
    id: string,
    user: UpdateUserDto,
    file: File & { buffer: Buffer; originalname: string },
  ): Promise<User> {
    if (file) {
      const { originalname, buffer } = file;
      const imagePath = `./uploads/${originalname}`;
      fs.writeFileSync(imagePath, buffer);
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          ...user,
          userImg: `${process.env.URL}${originalname}`,
        },
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          ...user,
          userImg: '',
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }
  }

  async deleteUser(id: string): Promise<string> {
    await this.userModel.findByIdAndDelete(id);
    return 'User deleted';
  }
}
