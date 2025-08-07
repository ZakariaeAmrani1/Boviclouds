import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Identification, IdentificationSchema } from 'src/identification/schemas/identification.schema';
import { Lactation, LactationSchema } from 'src/lactation/schemas/lactation.schema';
import { Rebouclage, RebouclageSchema } from 'src/rebouclage/schemas/rebouclage.schema';
import {
  Insemination,
  InseminationSchema,
} from 'src/inseminations/schemas/insemination.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Identification.name, schema: IdentificationSchema },
      { name: Lactation.name, schema: LactationSchema },
      { name: Rebouclage.name, schema: RebouclageSchema },
      {name:  Insemination.name, schema: InseminationSchema}
    ])
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
