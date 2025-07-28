import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { User, UserSchema } from 'src/users/schemas/users/user.schema';
import { EmailModule } from 'src/utils/services/emails/email.module';
import { RateLimiterModule } from 'src/utils/services/rate-limiter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
    EmailModule,
    RateLimiterModule
  ],
  providers: [AuthService, UsersService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
