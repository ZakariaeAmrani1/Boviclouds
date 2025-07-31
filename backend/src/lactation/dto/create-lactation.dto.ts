import {
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLactationDto {
  @IsString()
  nni: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  date_velage?: Date;

  @IsOptional()
  @IsNumber()
  n_lactation?: number;

  @IsOptional()
  @IsNumber()
  lait_kg?: number;

  @IsOptional()
  @IsNumber()
  kg_mg?: number;

  @IsOptional()
  @IsNumber()
  pct_proteine?: number;

  @IsOptional()
  @IsNumber()
  pct_mg?: number;

  @IsOptional()
  @IsMongoId()
  responsable_laitier_id?: string;
}
