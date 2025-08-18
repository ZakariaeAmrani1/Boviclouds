import { IsString, IsDateString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateRebouclageDto {
  // @IsString()
  // @IsNotEmpty()
  // operation_id: string;

  // @IsString()
  // @IsNotEmpty()
  // id_sujet: string;

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
}
