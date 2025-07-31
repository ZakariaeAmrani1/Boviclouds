import { PartialType } from '@nestjs/mapped-types';
import { CreateLactationDto } from './create-lactation.dto';

export class UpdateLactationDto extends PartialType(CreateLactationDto) {}
