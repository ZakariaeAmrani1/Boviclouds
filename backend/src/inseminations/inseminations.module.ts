import { Module } from '@nestjs/common';
import { InseminationsService } from './inseminations.service';
import { InseminationsController } from './inseminations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Insemination, InseminationSchema } from './schemas/insemination.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Insemination.name,schema:InseminationSchema}])
  ],
  controllers: [InseminationsController],
  providers: [InseminationsService],
})
export class InseminationsModule {}
