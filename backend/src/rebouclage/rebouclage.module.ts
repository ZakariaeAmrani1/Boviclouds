import { Module } from '@nestjs/common';
import { RebouclageService } from './rebouclage.service';
import { RebouclageController } from './rebouclage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rebouclage, RebouclageSchema } from './schemas/rebouclage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rebouclage.name, schema: RebouclageSchema },
    ]),
  ],
  controllers: [RebouclageController],
  providers: [RebouclageService],
  exports: [RebouclageService],
})
export class RebouclageModule {}
