
import {
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsDateString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLactationDto {
  @IsOptional()
  @IsMongoId()
  sujet_id: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_velage?: Date;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  n_lactation: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  lait_kg: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  kg_mg: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  pct_proteine: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  pct_mg: number;

  @IsMongoId()
  @IsNotEmpty()
  controleur_laitier_id: string;
}
