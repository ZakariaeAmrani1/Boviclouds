import { Module } from '@nestjs/common';
import { MorphologieService } from './morphologie.service';
import { MorphologieController } from './morphologie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DetectionMorphologique, DetectionMorphologiqueSchema } from './schemas/morphologie.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:DetectionMorphologique.name,schema:DetectionMorphologiqueSchema}])],
  controllers: [MorphologieController],
  providers: [MorphologieService],
})
export class MorphologieModule {}
