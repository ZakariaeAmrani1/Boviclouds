import {
  IsString,
  IsDateString,
  IsOptional,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class InfosSujetDto {
  @IsString()
  nni: string;

  @IsDateString()
  date_naissance: string;

  @IsString()
  race: string;

  @IsString()
  sexe: string;

  @IsString()
  type: string;
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
  @IsMongoId()
  eleveur_id: string;

  @IsMongoId()
  exploitation_id: string;

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
}
