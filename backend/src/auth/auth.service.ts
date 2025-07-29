import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/users/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserMethods } from 'src/users/schemas/users/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/users/register.dto';
import { AccountStatus } from 'src/users/schemas/users/user.acc.status';
import { EmailService } from 'src/utils/services/emails/email.service';
import { RateLimiterService } from 'src/utils/services/rate-limiter.service';
import * as crypto from "crypto";

@Injectable()
export class AuthService {
  UserService: any;
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User, {}, UserMethods>,
    private readonly jwtService: JwtService,
    private readonly emailService:EmailService,
    private readonly rateLimiterService:RateLimiterService
  ) {}

  //
  async generateAccessToken(user: any): Promise<string> {
    if (!user?._id || !user?.email) {
      throw new BadRequestException('Invalid user data provided for token generation');
    }
    const payload = { sub: user._id, email: user.email,role:user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '1d',
    });
  }
  async register(dto: CreateUserDto, req:Request) {
    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) throw new ConflictException('Email already exists');
    const user = await new this.userModel(dto).save();
    const emailValToken = user.CreateEmailValiationToken();
    await user.save();
    const confirmEmailLink = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email/${emailValToken}`;
    try {
          await this.emailService.sendEmailVerification(
            user,
            confirmEmailLink,
          );
    } catch (error) {
          console.error(
            'Failed to send email verification during registration:',
            error,
          );
            throw new InternalServerErrorException(
            'User registered, but there was an issue sending the verification email. Please try logging in to resend the link.',
          );
    }
    return {
      status: 'success',
      message: 'User registered successfully. Please check your email for verification.',
      data: { user },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+passwordHash');
    if (!user || !(await user.correctPassword(dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if(!user || !user?.isEmailVerified)
      throw new UnauthorizedException('Email not confirmed. Please confirm your email and check again');
    if (!user || user?.statut !== AccountStatus.APPROVED)
      throw new UnauthorizedException('Account not approved');
    const access_token = await this.generateAccessToken(user);
    return {
      status: 'success',
      message: 'user logged in successfully',
      data: { access_token, user },
    };
  }
  //
  async confirmEmail(token:string){
    const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
    .toString();
    const user = await this.userModel.findOne({
      emailValToken:hashedToken,
      emailTokenExpires:{$gt:Date.now()}
    })
    if(!user) throw new BadRequestException("User not found! Or token expired");
    user.isEmailVerified = true;
    user.emailValToken = undefined;
    user.emailTokenExpires = undefined;
    await user.save({validateBeforeSave:false});
    return {message:"Your email has been confirmed."};
  }
  //
  async resendVerificationEmail(email: string, req: Request): Promise<{ message: string }> {
    // Implement rate limiting here based on IP or email to prevent abuse
    const ip = req.ip ?? "";
    const canResend = await this.rateLimiterService.canResendEmail(ip, email);
    if (!canResend) {
      throw new BadRequestException('Too many resend requests. Please try again later.');
    }
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // For security, always return a generic message to prevent email enumeration.
      return { message: 'If an account with that email exists, a new verification link has been sent.' };
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Your email is already verified. No need to resend.');
    }
    const GRACE_PERIOD = 60 * 1000; 
    if (user.emailValToken && user.emailTokenExpires && (user.emailTokenExpires > Date.now() + GRACE_PERIOD)) {
      return { message: 'Your current verification link is still valid. Please check your inbox or spam folder.' };
    }
    // Generate a new token
    const newEmailValToken = user.CreateEmailValiationToken();
    await user.save();
    const confirmEmailLink = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email/${newEmailValToken}`;
    try {
      await this.emailService.sendEmailVerification(
        user,
        confirmEmailLink,
      );
    } catch (error) {
      console.error('Failed to send resend verification email:', error);
      throw new InternalServerErrorException(
        'Failed to send new verification email. Please try again later.'
      );
    }
    return { message: 'A new verification link has been sent to your email.' };
  }

}
