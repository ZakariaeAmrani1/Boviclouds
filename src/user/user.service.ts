import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: any): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const createdUser = new this.userModel({ ...data, password: hashedPassword });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
  async demandeCreationCompte(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      ...dto,
      role: dto.role ?? 'eleveur',
      metadata: {
        statut: 'en_attente',
        raison_sociale: dto.raison_sociale || '',
      },
    });
    return user.save();
  }


}
