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
import { IdentificationModule } from './identification/identification.module';
import { LactationModule } from './lactation/lactation.module';
import { RacesModule } from './races/races.module';
import { StatsModule } from './stats/stats.module';

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
    IdentificationModule,
    AuthModule,
    UsersModule,
    AuthModule,
    AdminModule,
    InseminationsModule,
    SemencesModule,
    ExploitationsModule,
    SemencesModule,
    RebouclageModule,
    LactationModule,
    RacesModule,
    StatsModule,
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
