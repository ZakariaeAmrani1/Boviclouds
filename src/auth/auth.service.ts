import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  UserService: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) throw new ConflictException('Email already exists');

    
    const createdUser = new this.userModel({
      ...dto,

      date_creation: new Date(),
    });

    const user = await createdUser.save();
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { token, user };
  }
  async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.UserService.findByEmail(email);
  if (!user || user.metadata.statut !== 'valide') return null;

  const isMatch = await bcrypt.compare(pass, user.password);
  if (isMatch) return user;
  return null;
 }


}
