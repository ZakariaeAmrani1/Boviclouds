import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateUserDto } from 'src/auth/dto/users/validate-user.dto';
import { AccountStatus } from 'src/users/schemas/users/user.acc.status';
import { User } from 'src/users/schemas/users/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async validateUser(
    userId: string,
    validateUserDto: ValidateUserDto,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user || user?.statut === AccountStatus.APPROVED) {
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
}
