import { Module } from '@nestjs/common';
import { MorphologieService } from './morphologie.service';
import { MorphologieController } from './morphologie.controller';

@Module({
  controllers: [MorphologieController],
  providers: [MorphologieService],
})
export class MorphologieModule {}
