import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class MesureDto {
  @IsNumber()
  @IsNotEmpty()
  valeur: number;

  @IsString()
  @IsNotEmpty()
  unite: string;
}

export class CreateDetectionMorphologiqueDto {

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsNotEmpty()
  source_detection: string;

  @ValidateNested()
  @Type(() => MesureDto)
  hauteur_au_garrot: MesureDto;

  @ValidateNested()
  @Type(() => MesureDto)
  largeur_du_corps: MesureDto;

  @ValidateNested()
  @Type(() => MesureDto)
  longueur_du_corps: MesureDto;
}
