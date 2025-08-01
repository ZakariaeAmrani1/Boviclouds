
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User, UserMethods } from './schemas/users/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { console } from 'inspector';
import { Request } from 'express';
import { EmailService } from 'src/utils/services/emails/email.service';
import { UpdatePwdDto } from './dtos/update-pwd.dto';
import { UserRole } from './schemas/users/user.role';
import { ChangePwdDto } from './dtos/change-pwd.dto';

export class UserNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User, {}, UserMethods>,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<{
    status: string;
    results: number;
    data: User[];
  }> {
    const users = await this.userModel.find().lean();
    return {
      status: 'success',
      results: users.length,
      data: users,
    };
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user)
      throw new UserNotFoundException(`User with email:${email} not found!`);
    return user;
  }
  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UserNotFoundException(`User with id "${id}" not found`);
    }
    const user = await this.userModel.findById(id);
    if (!user) throw new UserNotFoundException(`User with id:${id} not found!`);
    return user;
  }
  async requestAccount(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return await user.save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UserNotFoundException(`User with id "${id}" not found`);
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
    console.log(user);
    if (!user) throw new UserNotFoundException(`User with id:${id} not found!`);
    return user;
  }

  async deleteUser(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UserNotFoundException(`User with id "${id}" not found`);
    }
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new UserNotFoundException(`User with id:${id} not found!`);
    if (user && user.role.includes(UserRole.ADMIN))
      throw new BadRequestException('Cannot delete an admin user.');
    return user;
  }

  async forgotPassword(
    email: string,
    req: Request,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new UserNotFoundException(`User with email:${email} not found!`);
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const frontUrl = process.env.FRONT_URL;
    // const confirmEmailLink = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
    const confirmEmailLink = `${frontUrl}changePassword?token=${resetToken}`;
    try {
      await this.emailService.sendPasswordReset(user, confirmEmailLink);
      return { message: 'Password reset link sent to your email.' };
    } catch (error) {
      console.error('Failed to send password reset link!', error);
    } finally {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return { message: 'Password reset link sent to your email.' };
  }
  async resetPassword(token: string, dto: UpdatePwdDto): Promise<User> {
    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Passwords do not match.');
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      throw new UserNotFoundException(
        'Invalid or expired password reset token.',
      );

    user.password = dto.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();
    return user;
  }

  async updatePassword(
    id: string,
    changePwdDto: ChangePwdDto,
  ): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UserNotFoundException(`User with id "${id}" not found`);
    }
    const user = await this.userModel.findById(id).select("+passwordHash");
    if (!user) throw new UserNotFoundException(`User with id:${id} not found!`);
    if (!(await user.correctPassword(changePwdDto.currentPassword)))
      throw new BadRequestException('Current password is incorrect.');
    if (changePwdDto.password !== changePwdDto.confirmPassword)
      throw new BadRequestException('Passwords do not match.');
    user.password = changePwdDto.password;
    await user.save();
    return user;
  }
}
