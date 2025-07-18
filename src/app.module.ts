import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { AdminModule } from './admin/admin.module';
import mongoose from 'mongoose';

@Module({
  imports: [
     MongooseModule.forRoot('mongodb+srv://amraouin28:nezha1234@clusterbovi0.rxfqiw2.mongodb.net/bovicloudsdb?retryWrites=true&w=majority&appName=ClusterBovi0'),
     AuthModule,
     UserModule,
     AuthModule,
     AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    mongoose.connection.on('connected', () => {
      console.log(' Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => { 
      console.error(' MongoDB connection error:', err);
    });
  }
}
