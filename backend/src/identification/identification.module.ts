import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Identification,
  IdentificationSchema,
} from './schemas/identification.schema';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { S3Module } from 'src/common/s3/s3.module';
import { HttpModule } from '@nestjs/axios';
import { AIModule } from 'src/common/ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Identification.name,
        schema: IdentificationSchema,
      },
    ]),
    S3Module,
    HttpModule,
    AIModule
  ],
  controllers: [IdentificationController],
  providers: [IdentificationService],
})
export class IdentificationModule {}
