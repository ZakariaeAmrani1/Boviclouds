import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/users/user.schema';
import { EmailModule } from 'src/utils/services/emails/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
