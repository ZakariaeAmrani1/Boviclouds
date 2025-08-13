import { Controller } from '@nestjs/common';
import { MorphologieService } from './morphologie.service';

@Controller('morphologie')
export class MorphologieController {
  constructor(private readonly morphologieService: MorphologieService) {}
}
