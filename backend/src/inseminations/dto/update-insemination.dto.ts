import { PartialType } from '@nestjs/mapped-types';
import { CreateInseminationDto } from './create-insemination.dto';

export class UpdateInseminationDto extends PartialType(CreateInseminationDto) {}
