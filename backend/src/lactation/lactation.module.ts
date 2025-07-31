import { Module } from '@nestjs/common';
import { LactationService } from './lactation.service';
import { LactationController } from './lactation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lactation, LactationSchema } from './schemas/lactation.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Lactation.name, schema:LactationSchema}
  ])],
  controllers: [LactationController],
  providers: [LactationService],
})
export class LactationModule {}
