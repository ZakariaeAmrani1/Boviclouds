import { IsString, IsNotEmpty, IsNumber, IsDateString, IsMongoId, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLactationDto {
  @IsMongoId()
  @IsNotEmpty()
  sujet_id: string;

  @IsDateString()
  @IsNotEmpty()
  date_velage: string;

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
