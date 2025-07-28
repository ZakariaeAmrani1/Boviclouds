import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InseminationsModule } from './inseminations/inseminations.module';

import { SemencesModule } from './semences/semences.module';
import { ExploitationsModule } from './exploitations/exploitations.module';
import { RebouclageModule } from './rebouclage/rebouclage.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        retryAttempts: 3,
        retryDelay: 2000,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AuthModule,
    AdminModule,
    InseminationsModule,

    SemencesModule,

    ExploitationsModule,
    SemencesModule,
    RebouclageModule,


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
