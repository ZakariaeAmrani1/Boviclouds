import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateUserDto } from 'src/auth/dto/users/validate-user.dto';
import { AccountStatus } from 'src/users/schemas/users/user.acc.status';
import { User, UserMethods } from 'src/users/schemas/users/user.schema';
import { CreateAccForUserDto } from './dtos/create-acc-for-user.dto';
import * as crypto from 'crypto';
import { EmailService } from 'src/utils/services/emails/email.service';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User, {}, UserMethods>,
    private readonly emailService: EmailService,
  ) {}
  async validateUser(
    userId: string,
    validateUserDto: ValidateUserDto,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (
      !user ||
      user?.statut === AccountStatus.APPROVED ||
      user?.isEmailVerified === false
    ) {
      return null;
    }
    user.role.push(validateUserDto.role);
    user.statut = AccountStatus.APPROVED;
    return await user.save();
  }

  async rejectRequest(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          statut: AccountStatus.REJECTED,
        },
      },
      { new: true },
    );
  }

<<<<<<< HEAD
  async createUserAccount(dto: CreateAccForUserDto,req:Request): Promise<User> {
    const userExists = await this.userModel.findOne({ email: dto.email, CIN:dto.CIN });
    if (userExists) throw new ConflictException('User with this email or CIN already exists');
=======
  async createUserAccount(dto: CreateAccForUserDto): Promise<User> {
>>>>>>> main
    const newUser = new this.userModel({
      ...dto,
      role: [dto.role],
    });
<<<<<<< HEAD
    const password = crypto.randomBytes(16).toString('hex');
    const emailValToken = newUser.CreateEmailValiationToken();
    await newUser.save({validateBeforeSave: false});
    const confirmEmailLink = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email/${emailValToken}`;
    try {
          await this.emailService.sendAccountCreationEmail(
            newUser,
            password,
            confirmEmailLink,
          );
    } catch (error) {
          console.error(
            'Failed to send email verification during registration:',
            error,
          );
    }
    newUser.password = password;
=======

>>>>>>> main
    return await newUser.save();
  }
}
