import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Identification, IdentificationSchema } from './schemas/identification.schema';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Identification.name, schema: IdentificationSchema }])],
  controllers: [IdentificationController],
  providers: [IdentificationService],
})
export class IdentificationModule {}
