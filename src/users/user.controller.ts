import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guadr';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get('get-me')
  async getMe(
    @Request() req: Request & { user: { id: string } },
  ): Promise<User> {
    return this.userService.getMe(req.user.id);
  }

  @Get(':username')
  async searchByTitle(
    @Param('username')
    username: string,
  ): Promise<User[]> {
    return this.userService.searchUser(username);
  }

  @Get('user/:userId')
  async getUser(
    @Param('userId')
    userId: string,
  ): Promise<User> {
    return this.userService.getUser(userId);
  }

  @Post('/sign-up')
  async createUser(@Body() userDto: CreateUserDto): Promise<string> {
    return this.userService.signUp(userDto);
  }

  @Post('/log-in')
  async loginUser(
    @Body() user: { username: string; password: string },
  ): Promise<string> {
    return this.userService.logIn(user);
  }

  @UseGuards(AuthGuard)
  @Put('/edit')
  @UseInterceptors(FileInterceptor('img'))
  async updateProfile(
    @Body()
    user: UpdateUserDto,
    @UploadedFile() file: any,
    @Request() req: Request & { user: { id: string } },
  ): Promise<User> {
    return this.userService.updateUser(req.user.id, user, file);
  }

  @UseGuards(AuthGuard)
  @Put('/delete')
  async deleteUser(
    @Body()
    @Request()
    req: Request & { user: { id: string } },
  ): Promise<string> {
    return this.userService.deleteUser(req.user.id);
  }
}
