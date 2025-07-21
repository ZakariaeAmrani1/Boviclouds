import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateUserDto } from 'src/auth/dto/users/validate-user.dto';
import { AccountStatus } from 'src/user/schemas/users/user.acc.status';
import { UserRole } from 'src/user/schemas/users/user.role';
import { User } from 'src/user/schemas/users/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async validateUser(userId:string,validateUserDto:ValidateUserDto): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user || user.metadata?.statut === AccountStatus.APPROVED) {
      return null;
    }
    if (!Array.isArray(user.role)) {
      user.role = [UserRole.ELEVEUR];
    }
    user.role.push(validateUserDto.role);
    user.metadata.statut = AccountStatus.APPROVED;
    user.markModified('metadata'); 
    return await user.save();
  }

  async rejectRequest(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          metadata: { statut: AccountStatus.REJECTED },
        },
      },
      { new: true },
    );
  }
}
