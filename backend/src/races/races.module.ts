import { Module } from '@nestjs/common';
import { RacesService } from './races.service';
import { RacesController } from './races.controller';
import { Race, RaceSchema } from './schemas/race.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: Race.name, schema:RaceSchema}])],
  controllers: [RacesController],
  providers: [RacesService],
})
export class RacesModule {}
