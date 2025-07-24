import { Module } from '@nestjs/common';
import { SemencesService } from './semences.service';
import { SemencesController } from './semences.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Semence, SemenceSchema } from './schemas/semence.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:Semence.name,schema:SemenceSchema}])],
  controllers: [SemencesController],
  providers: [SemencesService],
})
export class SemencesModule {}
