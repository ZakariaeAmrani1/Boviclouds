import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Identification, IdentificationSchema } from './schemas/identification.schema';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { S3Module } from 'src/common/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Identification.name,
        schema: IdentificationSchema 
      }
    ]),
    S3Module],
  controllers: [IdentificationController],
  providers: [IdentificationService],
})
export class IdentificationModule {}
