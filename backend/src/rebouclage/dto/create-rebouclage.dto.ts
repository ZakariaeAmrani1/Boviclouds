import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum RebouclageMode {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic'
}

export class CreateRebouclageDto {
  @IsString()
  @IsNotEmpty()
  operation_id: string;

  @IsString()
  @IsNotEmpty()
  id_sujet: string;

  @IsString()
  @IsNotEmpty()
  ancien_nni: string;

  @IsString()
  @IsNotEmpty()
  nouveau_nni: string;

  @IsDateString()
  @IsNotEmpty()
  date_creation: string;

  @IsMongoId()
  @IsNotEmpty()
  identificateur_id: string;

  @IsOptional()
  @IsEnum(RebouclageMode)
  mode?: RebouclageMode;
}

export class CreateRebouclageAutomaticDto {
  @IsString()
  @IsNotEmpty()
  nouveau_nni: string;

  @IsMongoId()
  @IsNotEmpty()
  identificateur_id: string;

  @IsOptional()
  @IsDateString()
  date_creation?: string;

  @IsEnum(RebouclageMode)
  mode: RebouclageMode;
}
