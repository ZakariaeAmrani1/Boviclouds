import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

export class UserNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<{
    status: string;
    results: number;
    data: UserResponseDto[];
  }> {
    const users = plainToInstance(
      UserResponseDto,
      await this.userModel.find().lean(),
      { excludeExtraneousValues: true },
    );
    return {
      status: 'success',
      results: users.length,
      data: users,
    };
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
  async requestAccount(dto: CreateUserDto): Promise<User> {
    //ddadadad
    const user = new this.userModel(dto);
    return plainToInstance(UserResponseDto, await user.save(), {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new UserNotFoundException(`User with id:${id} not found!`);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new UserNotFoundException(`User with id:${id} not found!`);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
