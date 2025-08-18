import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class MesureDto {
  @IsNumber()
  @IsNotEmpty()
  readonly valeur: number;

  @IsString()
  @IsNotEmpty()
  readonly unite: string;
}

export class CreateDetectionMorphologiqueDto {

  @IsString()
  @IsOptional()
  readonly image_url?: string;

  @IsString()
  @IsNotEmpty()
  readonly source_detection: string;

  @ValidateNested()
  @Type(() => MesureDto)
  readonly hauteur_au_garrot: MesureDto;

  @ValidateNested()
  @Type(() => MesureDto)
  readonly largeur_du_corps: MesureDto;

  @ValidateNested()
  @Type(() => MesureDto)
  readonly longueur_du_corps: MesureDto;
  @IsMongoId()
  readonly cow_id: string;
}
