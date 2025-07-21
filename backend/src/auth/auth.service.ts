import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/users/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserMethods } from 'src/user/schemas/users/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/users/register.dto';
import { AccountStatus } from 'src/user/schemas/users/user.acc.status';

@Injectable()
export class AuthService {
  UserService: any;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User,{},UserMethods>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) throw new ConflictException('Email already exists');
    const user = await new this.userModel(dto).save();
    return {
      status: 'success',
      message: 'user registred successfully',
      data: { user },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+passwordHash');
      // console.log(user);
    if (!user || !(await user.correctPassword(dto.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
    if(!user || user.metadata?.statut !== AccountStatus.APPROVED)
      throw new UnauthorizedException("Account not approved");
    const access_token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });
    return {
      status: 'success',
      message: 'user logged in successfully',
      data: { access_token, user },
    };
  }
}
