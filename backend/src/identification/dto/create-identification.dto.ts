import {
  IsString,
  IsDateString,
  IsOptional,
  IsMongoId,
  ValidateNested,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InfosSujetDto {
  @IsString()
  nni: string;

  @IsDateString()
  date_naissance: Date;

  @IsString()
  race: string;

  @IsString()
  sexe: string;

  @IsString()
  type: string;

  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  photos?: string[];
}

class InfosMereDto {
  @IsString()
  nni: string;

  @IsDateString()
  date_naissance: string;

  @IsString()
  race: string;
}

class AncetreDto {
  @IsString()
  nni: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsDateString()
  date_naissance: string;

  @IsString()
  race: string;
}

class ComplementDto {

  @IsString()
  @IsMongoId()
  eleveur_id: string;

  @IsString()
  @IsMongoId()
  exploitation_id: string;

  @IsString()
  @IsMongoId()
  responsable_local_id: string;
}

export class CreateIdentificationDto {

  @ValidateNested()
  @Type(() => InfosSujetDto)
  infos_sujet: InfosSujetDto;

  @ValidateNested()
  @Type(() => InfosMereDto)
  infos_mere: InfosMereDto;

  @ValidateNested()
  @Type(() => AncetreDto)
  grand_pere_maternel: AncetreDto;

  @ValidateNested()
  @Type(() => AncetreDto)
  pere: AncetreDto;

  @ValidateNested()
  @Type(() => AncetreDto)
  grand_pere_paternel: AncetreDto;

  @ValidateNested()
  @Type(() => AncetreDto)
  grand_mere_paternelle: AncetreDto;

  @ValidateNested()
  @Type(() => ComplementDto)
  complem: ComplementDto;

  @IsString()
  @IsMongoId()
  createdBy: string;
}
