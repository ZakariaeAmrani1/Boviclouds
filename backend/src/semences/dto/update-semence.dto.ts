import { PartialType } from '@nestjs/mapped-types';
import { CreateSemenceDto } from './create-semence.dto';

export class UpdateSemenceDto extends PartialType(CreateSemenceDto) {}
