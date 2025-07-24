import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(data: any): Promise<User> {
    const createdUser = new this.userModel(data);
    return await createdUser.save();
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
  async requestAccount(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }
}
